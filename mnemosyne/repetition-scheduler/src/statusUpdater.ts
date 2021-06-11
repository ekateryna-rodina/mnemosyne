import { RepetitionStatus } from "@meproj/common";
import moment from "moment";
import { RepetitionStatusUpdatedEventPublisher } from "./events/publishers/repetitionStatusUpdatedEventPublisher";
import { Repetition } from "./models/repetition";
import { natsWrapper } from "./natsWrapper";

export class StatusUpdater {
  static async checkAndUpdate() {
    // update db
    await Repetition.updateMany(
      {
        nextRepetition: {
          $lt: moment().add(24, "hours").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        },
      },
      { status: RepetitionStatus.Pending }
    );
    await Repetition.updateMany(
      {
        $and: [
          {
            nextRepetition: {
              $lt: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            },
          },
          {
            $or: [
              { status: RepetitionStatus.Idle },
              { status: RepetitionStatus.Pending },
            ],
          },
        ],
      },
      { status: RepetitionStatus.InProgress }
    );

    // publish events
    const idleRepetitions = await Repetition.find({
      status: RepetitionStatus.Idle,
    });
    const idleRepetitionsIds = idleRepetitions.map((r) => r.id);

    const pendingRepetitions = await Repetition.find({
      status: RepetitionStatus.Pending,
    });
    const pendingRepetitionsIds = idleRepetitions.map((r) => r.id);

    const inProgressRepetitions = await Repetition.find({
      status: RepetitionStatus.InProgress,
    });
    const inProgressRepetitionsIds = idleRepetitions.map((r) => r.id);
    // idle status
    new RepetitionStatusUpdatedEventPublisher(natsWrapper.client).publish({
      status: RepetitionStatus.Idle,
      repetitionIds: idleRepetitionsIds,
    });
    // in progress status
    await new RepetitionStatusUpdatedEventPublisher(natsWrapper.client).publish(
      {
        status: RepetitionStatus.InProgress,
        repetitionIds: inProgressRepetitionsIds,
      }
    );
    // pending status
    await new RepetitionStatusUpdatedEventPublisher(natsWrapper.client).publish(
      {
        status: RepetitionStatus.Pending,
        repetitionIds: pendingRepetitionsIds,
      }
    );
  }
}
