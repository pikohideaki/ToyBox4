import { ToyBox4Page } from './app.po';

describe('toy-box4 App', () => {
  let page: ToyBox4Page;

  beforeEach(() => {
    page = new ToyBox4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
