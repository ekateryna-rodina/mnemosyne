import configureRequest from "../utils/configureRequest";

const StatsPage = ({ currentUser }) => {
  console.log(currentUser);
  {
    if (!currentUser) {
      return <div>No access</div>;
    }
    return <div>show me my stats/library</div>;
  }
};

StatsPage.getInitialProps = async (context) => {
  const client = configureRequest(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default StatsPage;
