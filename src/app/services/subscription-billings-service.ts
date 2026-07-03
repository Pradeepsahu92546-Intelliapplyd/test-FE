import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Invoices } from '../components/payment-invoices/invoices/invoices';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBillingsService {
  constructor(private http: HttpClient) {}
  get baseUrl(): string {
    return environment.apiUrl;
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // ------ Billing section------

  // fetch billing history for a user
  getBillingList(): Observable<any> {
    // Mock response
    // const mockBillingList = {
    //   billings: [
    //     {
    //       id: '308c3ea7-90e6-4145-bf30-c05c0321en34',
    //       userSub: 'xavier_o -pro', // subscriptions title
    //       address: 'Hsr layout, Bangalore, India , Pin - 547012',
    //       billDate: '2025-06-11',
    //       dueDate: '2025-06-11',
    //       nextBillDate: null,
    //       payStatus: 'pending',
    //       payId: null,
    //       payMethod: null,
    //       isTrail: false,
    //       isRecurring: true,
    //       isBillable: true,
    //       billableAmount: 800.0,
    //       createdAt: '2025-06-11T08:52:37.016303Z',
    //       updatedAt: '2025-06-11T08:52:37.016327Z',
    //       description: null,
    //     },
    //     {
    //       id: '308c3ea7-90e6-4145-bf30-c05c0321de8c',
    //       userSub: 'Tata_plantA - Pro',
    //       address: '',
    //       billDate: '2025-06-11',
    //       dueDate: '2025-06-11',
    //       nextBillDate: null,
    //       payStatus: 'pending',
    //       payId: null,
    //       payMethod: null, // added payMethod: "cash" (so in ui disable pay button)
    //       isTrail: false,
    //       isRecurring: true,
    //       isBillable: true,
    //       billableAmount: 1000.0, // removed this field from BE so it should be remove FE also
    //       createdAt: '2025-06-11T08:55:02.116103Z',
    //       updatedAt: '2025-06-11T08:55:02.116146Z',
    //       description: null,
    //     },
    //   ],
    // };

    // return of({
    //   code: 200,
    //   data: mockBillingList,
    //   message: 'Billing list fetched successfully',
    //   meta: {
    //     count: 2,
    //     next: null,
    //     previous: null,
    //   },
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/billings/`;
    return this.http.get(url, this.httpOptions);
  }

  // ------ Transaction and invoice Section  ------
  // get invoice-list
  getInvoiceList(): Observable<any> {
    // mock data
    //   const mockInvoiceList = {
    //    invoices: [
    //       {
    //         id: '2582138000000221015', // rename from invoiceId
    //         achPaymentInitiated: false, // this filed remove from the BE so remove from FE also
    //         num: 'INV-000081', // rename the field from number
    //         invoiceNumber: 'INV-000081', // that is removed from BE so remove from FE also
    //         customerId: '2582138000000033038', // that is removed from BE so remove from FE also
    //         customerName: 'test', // that is removed from BE so remove from FE also
    //         email: 'vijaycriss123@gmail.com', // that is removed from BE so remove from FE also
    //         projectName: '',// that is removed from BE so remove from FE also
    //         referenceNumber: '',// that is removed from BE so remove from FE also
    //         invoiceDate: '2025-06-13',
    //         dueDate: '2025-06-13', 
    //         currencyCode: 'INR', // // that is removed from BE so remove from FE also
    //         currencySymbol: 'Rs.', //// that is removed from BE so remove from FE also
    //         totalPrice: 773.34, // renamed from total
    //         balance: 773.34,
    //         status: 'sent',
    //         transactionType: 'renewal',
    //         createdTime: '2025-06-13T06:24:29+0530',
    //         updatedTime: '2025-06-13T06:24:29+0530',
    //         createdBy: 'Zoho Billing',
    //         paymentExpectedDate: '',
    //         salesperson: '',
    //         salespersonName: '',
    //         country: '',
    //         phone: '',
    //         billingAddress: {
    //           street: '',
    //           street2: '',
    //           city: '',
    //           state: '',
    //           zipcode: '',
    //           country: '',
    //           phone: '',
    //           fax: '',
    //           attention: '',
    //         },
    //         shippingAddress: {
    //           street: '',
    //           street2: '',
    //           city: '',
    //           state: '',
    //           zipcode: '',
    //           country: '',
    //           phone: '',
    //           fax: '',
    //           attention: '',
    //         },
    //         billingStreet: '',
    //         billingStreet2: '',
    //         billingCity: '',
    //         billingState: '',
    //         billingZipcode: '',
    //         billingCountry: '',
    //         billingPhone: '',
    //         shippingStreet: '',
    //         shippingStreet2: '',
    //         shippingCity: '',
    //         shippingState: '',
    //         shippingZipcode: '',
    //         shippingCountry: '',
    //         shippingPhone: '',
    //         isViewedByClient: false,
    //         clientViewedTime: '',
    //         cfOrganizationName: 'test-org',
    //         cfOrganizationNameUnformatted: 'test-org',
    //         hasAttachment: false,
    //         isViewedInMail: false,
    //         mailFirstViewedTime: '',
    //         mailLastViewedTime: '',
    //       },
    //     ],
    //   };
    //   return of({
    //     code: 200,
    //     data: mockInvoiceList,
    //     message: 'Invoice list fetched successfully',
    //     meta: {
    //       count: 1,
    //       next: null,
    //       previous: null,
    //     },
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   }).pipe(delay(10));

    // real API integration
    const url = `${this.baseUrl}/v1/auth/payment-invoice/invoices/`;
    return this.http.get(url, this.httpOptions);
  }

  //  get transaction list
  getTransactionList(): Observable<any> {
    // mock data (uncomment for local development)
    // const mockTransactionList = {
    //   payments: [ // renemd to payments
    //     {
    //       paymentId: '2582138000000236062',
    //       invoiceNumber: 'INV-000080',
    //       date: '2025-06-12',
    //       transactionTime: '2025-06-12T00:00:00+0530',
    //       mode: 'Test Gateway',
    //       type: 'others',
    //       txnType: 'payment',
    //       status: 'success',
    //       amount: 800.0,
    //       email: 'vijaycriss123@gmail.com',
    //     },
    //   ],
    // };
    // return of({
    //   code: 200,
    //   data: mockTransactionList,
    //   message: 'Transaction list fetched successfully',
    //   meta: {
    //     count: 1,
    //     next: null,
    //     previous: null,
    //   },
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10));

    // real API integration
    const url = `${this.baseUrl}/v1/auth/payment-invoice/payments/`;
    return this.http.get(url, this.httpOptions);
  }

  // ------ Subcription section ------
  // user subscription list
  getSubscriptionList(): Observable<any> {
    // Mock response
    // const mockSubscriptionList = {
    //   subs: [
    //     {
    //       id: 'a24e2701', // no change
    //       unit: 'xavier_o', // no change
    //       plan: 'Pro (Tier 1)', //  no change
    //       startDate: '2025-06-09', //  no change
    //       endDate: '2025-07-09', // no change
    //       status: 'Live', // no change
    //       amount: 800.0, // field name rename to initialPrice
    //       createdAt: '2025-06-09T09:18:46.522662Z', // field name rename to  cretAt
    //       updatedAt: '2025-07-09T10:35:13.348273Z',// field name rename to updtAt
    //       description: null, // field name rename to  descrpt
    //     },
    //     {
    //       id: 'a24e2802',
    //       unit: 'Tata_plantA',
    //       plan: 'Pro (Tier 1)',
    //       startDate: '2025-06-09',
    //       endDate: '2025-07-09',
    //       status: 'Cancelled',
    //       amount: 1200.0,
    //       createdAt: '2025-06-09T09:18:46.522662Z',
    //       updatedAt: '2025-06-09T10:35:13.348273Z',
    //       description: null,
    //     },
    //     {
    //       id: 'a24e2902',
    //       unit: 'Tata_plantB',
    //       plan: 'Pro (Tier 1)',
    //       startDate: '2025-06-09',
    //       endDate: '2025-07-09',
    //       status: 'Expired',
    //       amount: 599.0,
    //       createdAt: '2025-06-09T09:18:46.522662Z',
    //       updatedAt: '2025-06-09T10:35:13.348273Z',
    //       description: null,
    //     },
    //   ],
    // };

    // return of({
    //   code: 200,
    //   data: mockSubscriptionList,
    //   message: 'Subscription list fetched successfully',
    //   meta: {
    //     count: 2,
    //     next: null,
    //     previous: null,
    //   },
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/list/`;
    return this.http.get(url, this.httpOptions);
  }

  // one unit subscription details
  getSubscriptionDetails(unit_name: string): Observable<any> {
    // Mock response
    // const mockSubscriptionDetails = {
    //   id: 'a24e2701', // no change
    //   unit: 'xavier_o', // no change
    //   plan: 'Pro (Tier 1)',// no change
    //   startDate: '2025-06-09', // no change
    //   endDate: '2025-07-09', // no change
    //   status: 'Live',// no change
    //   amount: 800.0, // field name rename to initialPrice
    //   createdAt: '2025-06-09T09:18:46.522662Z', // field name rename to  cretAt
    //   updatedAt: '2025-06-09T10:35:13.348273Z',// field name rename to updtAt
    //   description: null, // field name rename to  descrpt
    // };
    // return of({
    //   code: 200,
    //   data: mockSubscriptionDetails,
    //   message: 'Subscription details fetched successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/${unit_name}`;
    return this.http.get(url, this.httpOptions);
  }

  // Delete a subscrption  (only cancelled or expired subscription can be deleted in so delete only visisble that type subscription)
  deleteSubscription(unit_name: string): Observable<any> {
    console.log('Deleting subscription for unit:', unit_name);
    // Mock response
    // return of({
    //   status: 204,
    //   message: 'Subscription deleted successfully',
    //   data: null,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/details/${unit_name}`;
    console.log('API URL for deleting subscription:', url);
    return this.http.delete(url, this.httpOptions);
  }

  // cancel a subscription (only active/live subscription can be cancelled so only show cancel option for that type subscription)
  cancelSubscription(unit_name: string): Observable<any> {
    console.log('Cancelling subscription for unit:', unit_name);
    // Mock response
    // return of({
    //   code: 200,
    //   message: 'Subscription cancelled successfully',
    //   data: null,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/${unit_name}/cancel/`;
    return this.http.post(url, this.httpOptions);
  }

  // reactivate a subscription (only cancelled/expired subscription can be reactivated so only show reactivate option for that type subscription)
  reactivateSubscription(unit_name: string): Observable<any> {
    console.log('Reactivating subscription for unit:', unit_name);
    // Mock response
    // return of({
    //   code: 200,
    //   message: 'Subscription reactivated successfully',
    //   data: null,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/${unit_name}/reactivate/`;
    return this.http.post(url, this.httpOptions);
  }

  //recentactivities of a unit subscription ( every unit only one subscription so we can fetch activities with unit name )
  getRecentActivities(unit_name: string): Observable<any> {
    // mock data
    // const mockResponse = [
    //   {
    //     activityId: '2582138000000199015',
    //     description:
    //       'Scheduled end-of-term cancellation was removed, and the subscription - Test-organization-Pro is no longer non-renewing.',
    //     activityTime: '2025-06-11',
    //     commentedBy: 'DevOne',
    //   },
    //   {
    //     activityId: '2582138000000199005',
    //     description:
    //       'Subscription will be cancelled at end of period for Test-organization-Pro',
    //     activityTime: '2025-06-10',
    //     commentedBy: 'DevOne',
    //   },
    //   {
    //     activityId: '2582138000000192005',
    //     description:
    //       'Custom Function verify_org failed to execute for the workflow verify_org.',
    //     activityTime: '2025-06-09',
    //     commentedBy: 'Zoho Billing',
    //   },
    // ];

    // // Mock response
    // return of({
    //   code: 200,
    //   data: mockResponse,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/auth/subscriptions/${unit_name}/activities/`;
    return this.http.get(url, this.httpOptions);
  }

  // subcription for a new plan for a unit
  subscribePlan(data: any): Observable<any> {
    // mock request data
    // data = {
    //   plan: {
    //     plan_code: 'pro-monthly',
    //     name: 'Pro',
    //   },
    //   addons: [
    //     {
    //       addon_code: 'asset',
    //       addon_description: 'asset',
    //       quantity: 1,
    //       tax_id: '903002205046032',
    //     },
    //   ],
    //   coupon_code: 'FIRST',
    //   payment_terms: 0,
    //   payment_terms_label: 'Due on Receipt',
    //   starts_at: '2025-24-05',
    //   exchange_rate: 2,
    //   reference_id: 'intel',
    //   custom_fields: [
    //     {
    //       label: 'organization_name',
    //       value: 'xavier_o',
    //     },
    //   ],
    //   auto_collect: false,
    //   card_id: '903002205046054',
    //   payment_gateways: [
    //     {
    //       payment_gateway: 'payflow_pro',
    //     },
    //   ],
    //   auto_renew: false,
    //   trial_days: 14,
    // };

    // return of({
    //   code: 200,
    //   data: {
    //     subscriptionName: 'Test-organization-Pro',
    //     status: 'live',
    //     amount: 800.0,
    //     currency: 'INR',
    //     planName: 'Pro',
    //     planCode: 'pro-monthly',
    //     customerEmail: 'vijaycriss123@gmail.com',
    //     organizationName: 'xavier_o',
    //     startDate: '2025-06-11',
    //     endDate: '2025-07-11',
    //     nextBillingAt: '2025-07-11',
    //     message: 'Subscription created.',
    //   },
    //   meta: {},
    //   requestId: '2525acd6-1fb7-41e3-8b7e-380de5976539',
    //   timestamp: '2025-06-11T08:52:37Z',
    // }).pipe(delay(10));

    // real API integration
    const url = `${this.baseUrl}/v1/users/subscriptions/subscribe/`;
    return this.http.post(url, data, this.httpOptions);
  }

  // update subscription plan for a unit using unit name )
  updateSubscriptionPlan(unit_name: string, data: any): Observable<any> {
    // request body
    const requestBody = {
      card_id: '903002205046054',
      exchange_rate: 50,
      plan: {
        plan_code: 'pro-monthly',
        name: 'Pro',
      },
      addons: [
        {
          addon_code: 'asset',
          quantity: 5,
          tax_id: '903002205046032',
        },
      ],
      coupon_code: 'THANKSGIVING20',
      auto_collect: true,
      end_of_term: true,
      payment_terms: '30',
      payment_terms_label: 'Net 30',
    };
    return of({
      code: 200,
      data: {
        subscriptionName: 'Test-organization-Pro',
        status: 'live',
        amount: 800.0,
        currency: 'INR',
        planName: 'Pro',
        planCode: 'pro-monthly',
        customerEmail: 'vijaycriss123@gmail.com',
        organizationName: 'xavier_o',
        startDate: '2025-06-11',
        endDate: '2025-07-11',
        nextBillingAt: '2025-07-11',
        message: 'Subscription updated successfully.',
      },
      meta: {},
      requestId: '2525acd6-1fb7-41e3-8b7e-380de5976539',
      timestamp: '2025-06-11T08:52:37Z',
    }).pipe(delay(10));

    // const url = `${this.baseUrl}/v1/auth/subscriptions/details/${unit_name}/`;
    // return this.http.post(this.baseUrl + url, data, this.httpOptions);
  }
}
