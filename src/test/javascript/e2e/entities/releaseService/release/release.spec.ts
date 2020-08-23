import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { ReleaseComponentsPage, ReleaseDeleteDialog, ReleaseUpdatePage } from './release.page-object';

const expect = chai.expect;

describe('Release e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let releaseComponentsPage: ReleaseComponentsPage;
  let releaseUpdatePage: ReleaseUpdatePage;
  let releaseDeleteDialog: ReleaseDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Releases', async () => {
    await navBarPage.goToEntity('release');
    releaseComponentsPage = new ReleaseComponentsPage();
    await browser.wait(ec.visibilityOf(releaseComponentsPage.title), 5000);
    expect(await releaseComponentsPage.getTitle()).to.eq('Releases');
    await browser.wait(ec.or(ec.visibilityOf(releaseComponentsPage.entities), ec.visibilityOf(releaseComponentsPage.noResult)), 1000);
  });

  it('should load create Release page', async () => {
    await releaseComponentsPage.clickOnCreateButton();
    releaseUpdatePage = new ReleaseUpdatePage();
    expect(await releaseUpdatePage.getPageTitle()).to.eq('Create or edit a Release');
    await releaseUpdatePage.cancel();
  });

  it('should create and save Releases', async () => {
    const nbButtonsBeforeCreate = await releaseComponentsPage.countDeleteButtons();

    await releaseComponentsPage.clickOnCreateButton();

    await promise.all([
      releaseUpdatePage.setTitleInput('title'),
      releaseUpdatePage.setTypeInput('type'),
      releaseUpdatePage.statusSelectLastOption(),
      releaseUpdatePage.setDeadlineInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      releaseUpdatePage.setTasksInput('tasks'),
    ]);

    expect(await releaseUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await releaseUpdatePage.getTypeInput()).to.eq('type', 'Expected Type value to be equals to type');
    expect(await releaseUpdatePage.getDeadlineInput()).to.contain('2001-01-01T02:30', 'Expected deadline value to be equals to 2000-12-31');
    expect(await releaseUpdatePage.getTasksInput()).to.eq('tasks', 'Expected Tasks value to be equals to tasks');

    await releaseUpdatePage.save();
    expect(await releaseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await releaseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Release', async () => {
    const nbButtonsBeforeDelete = await releaseComponentsPage.countDeleteButtons();
    await releaseComponentsPage.clickOnLastDeleteButton();

    releaseDeleteDialog = new ReleaseDeleteDialog();
    expect(await releaseDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Release?');
    await releaseDeleteDialog.clickOnConfirmButton();

    expect(await releaseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
