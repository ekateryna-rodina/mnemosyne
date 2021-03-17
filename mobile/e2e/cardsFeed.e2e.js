describe('App', () => {
  it('should show flatlist filled with user cards', async () => {
    await expect(element(by.id('cardsFeed'))).toExist();
    await expect(element(by.id('imagePreview'))).toExist();
    await expect(element(by.id('contentTextPreview'))).toExist();
    await expect(element(by.id('tagsPreview'))).toExist();
    await expect(element(by.id('trainInfoPreview'))).toExist();
    await expect(element(by.id('favoriteIconPreview'))).toExist();
  });
  it('should show filter,sorting options and add new card buttons', async () => {
    await expect(element(by.id('searchInput'))).toExist();
    await expect(element(by.id('searchButton'))).toExist();
    await expect(element(by.id('showFilterButton'))).toExist();
    await expect(element(by.id('showSortButton'))).toExist();
    await expect(element(by.id('showAddCardButton'))).toExist();
    await expect(element(by.id('email'))).toBeVisible();
  });
  it('should show filters', async () => {
    await expect(element(by.id('filtersContainer'))).not.toExist();
    element(by.id('showFilterButton')).tap();
    await waitFor(element(by.id('filtersContainer')))
      .toExist()
      .withTimeout(1000);
    await expect(element(by.id('tagsInput'))).toExist();
    await expect(element(by.id('favoritesCheckBox'))).toExist();
  });
  it('should allow to search', async () => {
    const searchTerm = 'Mona';
    await element(by.id('searchInput')).typeText(searchTerm);
    await element(by.id('searchButton')).tap();
  });
  it('should hide clear search button if input is empty', async () => {
    const searchTerm = 'Mona';
    await expect(element(by.id('clearSearch'))).not.toExist();
    await element(by.id('searchInput')).typeText(searchTerm);
    await expect(element(by.id('clearSearch'))).toExist();
  });
  // it('should show card actions', async () => {
  //   // await element(by.id('singleCardFeed')).swipe('left');
  // });
});
