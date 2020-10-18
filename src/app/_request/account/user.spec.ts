// import {Account} from './account';

// describe('Account', () => {
//   it('should create an instance', () => {
//     expect(new Account()).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';

import { AccountService } from './user.service';

describe('Admin.ServiceService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
