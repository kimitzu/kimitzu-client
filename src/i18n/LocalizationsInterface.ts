export interface LocalizationsInterface {
  localizations: Localizations
}

export interface Localizations {
  usernameLabel: string
  passwordLabel: string
  emailLabel: string
  locationLabel: string
  descriptionLabel: string
  generalLabel: string
  nextBtnText: string
  loginBtnText: string
  deleteBtnText: string
  cancelBtnText: string
  changePhotoBtnText: string
  homeBtnText: string
  saveBtnText: string
  titleLabel: string
  typeLabel: string
  yesText: string
  noText: string
  startDateLabel: string
  endDateLabel: string
  addEntryText: string
  peerID: string
  minimum: string
  maximum: string
  advancedSearch: string
  addFilter: string
  reset: string
  search: string
  close: string
  intro: Intro
  moderatorsText: string
  skillsText: string
  competenciesText: string
  homePage: HomePage
  searchFilters: SearchFilters
  navigationBar: NavigationBar
  registrationPage: RegistrationPage
  userForm: UserForm
  tosPage: TosPage
  addressForm: { [key: string]: string }
  listingForm: ListingForm
  photoSlideshow: PhotoSlideshow
  moderatorSelectionForm: { [key: string]: string }
  profilePage: ProfilePage
  followButton: FollowButton
  blockButton: BlockButton
  settingsPage: SettingsPage
  orderHistoryPage: OrderHistoryPage
  orderViewPage: OrderViewPage
  paymentQRCard: PaymentQRCard
  disputeViewPage: { [key: string]: string }
  walletView: WalletView
  checkoutPage: CheckoutPage
  moderatorInfoModal: ModeratorInfoModal
  moderatorForm: { [key: string]: string }
  socialMediaForm: SocialMediaForm
  educationForm: EducationForm
  employmentForm: EmploymentForm
  customDescriptionForm: CustomDescriptionForm
  listingPage: ListingPage
  tosCard: TosCard
  chatComponent: ChatComponent
  constants: Constants
  errors: Errors
  mobileHeader: MobileHeader
}

export interface Errors {
  ERROR_INSUFFICIENT_FUNDS: string
  "vendor's identity signature on contact failed to verify": string
}

export interface BlockButton {
  blockBtnText: string
  blockedBtnText: string
  blockedBtnTip: string
}

export interface ChatComponent {
  emptyConvoText: string
  messagesText: string
  messagePlaceholder: string
}

export interface CheckoutPage {
  spinnerText: string
  requestAddressParagraph: string
  couponForm: CouponForm
  paymentForm: PaymentForm
  expandModeratorLink: string
  additionalForm: AdditionalForm
  listingOwnerHelper: string
  receivedPaymentHeader1: string
  receivedPaymentHeader2: string
  receivedPaymentParagraph: string
  receivedPaymentLink: string
  applyCouponFailNotif: string
  paymentCard: { [key: string]: string }
  listingCard: ListingCard
}

export interface AdditionalForm {
  header: string
  memoLabel: string
  memoPlaceholder: string
}

export interface CouponForm {
  header: string
  inputPlaceholder: string
  submitBtnText: string
}

export interface ListingCard {
  itemLabel: string
  classificationLabel: string
  priceLabel: string
  quantityLabel: string
}

export interface PaymentForm {
  header: string
  directLabel: string
  moderatedPayment: string
}

export interface Constants {
  sortOptions: { [key: string]: string }
  singulars: Plurals
  plurals: Plurals
  serviceRateMethods: Plurals
  filters: Filters
}

export interface Filters {
  unfunded: Cancelled
  pending: Cancelled
  processing: Cancelled
  fulfilled: Cancelled
  completed: Cancelled
  refunded: Cancelled
  disputes: Cancelled
  cancelled: Cancelled
  errors: Cancelled
}

export interface Cancelled {
  states: string[]
  description: string
}

export interface Plurals {
  PER_HOUR: string
  PER_DAY: string
  PER_MONTH: string
  PER_MILESTONE: string
  FIXED: string
}

export interface CustomDescriptionForm {
  saveSuccessNotif: string
  labelLabel: string
  placeholder: string
  valueLabel: string
  submitBtnText: string
}

export interface EducationForm {
  institutionLabel: string
  institutionPlaceholder: string
  degreeLabel: string
  degreePlaceholder: string
  descriptionPlaceholder: string
  currentlyStudyingLabel: string
}

export interface EmploymentForm {
  companyLabel: string
  positionLabel: string
  positionPlaceholder: string
  descriptionPlaceholder: string
  currentlyWorkingLabel: string
}

export interface FollowButton {
  followBtnText: string
  followingBtnText: string
  followingBtnTip: string
}

export interface HomePage {
  headerDropdownPlaceholder: string
  crawlingHeader: string
  crawlingContent1: string
  crawlingContent2: string
  noResultsHeader: string
  noResultsContent: string
  noResultsSuggestionsText: string
  noResultsSuggestions: string[]
}

export interface Intro {
  helper: string
  nextBtnText: string
  appDescription: string
}

export interface ListingForm {
  updateBtnText: string
  addBtnText: string
  classificationLabel: string
  titleDescriptor: string
  priceLabel: string
  priceDescriptor: string
  rateMethodLabel: string
  rateMethodDescriptor: string
  serviceQuantityLabel: string
  serviceQuantityDescriptor: string
  matureContentLabel: string
  photoLabel: string
  tagsLabel: string
  tagsPlaceholder: string
  tagsDescriptor: string
  tagsHelper: string
  termsAndConditionsLabel: string
  termsAndConditionsDescriptor: string
  moderatorsHelper1: string
  moderatorsHelper2: string
  moderatorsHelperLink: string
  couponsHelper: string
  couponTitleLabel: string
  couponTitlePlaceholder: string
  couponCodeLabel: string
  couponCodePlaceholder: string
  couponDiscountLabel: string
  couponDiscountPlaceholder: string
  addCouponLink: string
  percentLabel: string
  currenciesDescriptor: string
  abandonPrompt: string
  notifications: Notifications
  navItems: ListingFormNavItems
}

export interface ListingFormNavItems {
  moderatorsLabel: string
  photosLabel: string
  couponsLabel: string
  currenciesLabel: string
}

export interface Notifications {
  cannotEdit: string
  addSuccess: string
  updateSuccess: string
}

export interface ListingPage {
  retrieveListingSpinnerText: string
  retrieveRatingsSpinnerText: string
  listingRenewedNotif: string
  expiredListingHelper1: string
  expiredListingHelper2: string
  renewLink: string
  editBtnText: string
  deleteListingPromptText: string
  deleteListingSuccessNotif: string
  reviewsText: string
  noRatingsText: string
  classificationLabel: string
  paymentMethodsLabel: string
  tagsLabel: string
  checkoutBtnText: string
  contactHeader: string
  educationHeader: string
  workHeader: string
  skillsHeader: string
  emptyTosContentParagraph: string
  notFoundComponent: NotFoundComponent
  listingRenewPrompt: string
}

export interface NotFoundComponent {
  header: string
  paragraph: string
  suggestionsText: string
  suggestions: string[]
}

export interface ModeratorInfoModal {
  messageBtnText: string
  feeLabel: string
  currenciesLabel: string
  languagesLabel: string
  termsAndConditionsHeader: string
}

export interface NavigationBar {
  createNewListingLabel: string
  purchaseHistoryLabel: string
  salesHistoryLabel: string
  caseHistoryLabel: string
  profileLabel: string
  walletLabel: string
  settingsLabel: string
  supportLabel1: string
  supportLabel2: string
  searchPlaceholder: string
}

export interface OrderHistoryPage {
  searchPlaceholder: string
  filterSidebar: FilterSidebar
  totalLabel: string
  orderLabel: string
  dateLabel: string
  statusLabel: string
  purchasesLabel: string
  salesLabel: string
  casesLabel: string
}

export interface FilterSidebar {
  header: string
  resetBtnText: string
}

export interface OrderViewPage {
  cancelPromptParagraph: string
  cancelText: string
  cancelOrderActionParagraph: string
  cancelOrderText: string
  cancelOrderHeader: string
  canceledOrderHeader: string
  retrieveOrderText: string
  retrieveDiscussionsText: string
  summaryText: string
  fulfillOrderText: string
  discussionText: string
  prepareDisputeText: string
  saleText: string
  purchaseText: string
  orderText: string
  orderDetails: OrderDetails
  disputeForm: DisputeForm
  fulfillOrderForm: FulfillOrderForm
  stepperTexts: StepperTexts
  processErrorHeader: string
  disputeExpiredHeader: string
  refundedHeader: string
  refundedParagraph: string
  orderProcessErrorParagraph: string
  disputeExpiredParagraph: string
  disputeClosedHeader: string
  payoutAcceptedHeader: string
  disputePayoutHeader: string
  releaseFundBtnText: string
  disputeStartedHeader: string
  disputingHeader: string
  discussBtnText: string
  disputingParagraph: string
  disputeOrderHeader: string
  disputeBtnText: string
  disputeOrderParagraph1: string
  disputeOrderParagraph2: string
  completedHeader: string
  completeOrderText: string
  fulfilledHeader: string
  orderAcceptedHeader: string
  refundLink: string
  fulfillOrderBtnText: string
  orderAcceptedParagraph1: string
  orderAcceptedParagraph2: string
  orderAcceptedParagraph3: string
  paymentHeader: string
  partialPaymentText: string
  fullPaymentText: string
  sendPaymentHeader: string
  paymentSuccessNotif: string
  awaitingPaymentHeader: string
  awaitingPaymentParagraph: string
  orderDetailsHeader: string
  refundSuccessNotif: string
  refundErrorNotif: string
  completedSuccessNotif: string
  fulfilledSuccessNotif: string
  openDisputeSuccessNotif: string
  fundReleaseSuccessNotif: string
  acceptedOrderHeader: string
  orderAcceptedParagraph: string
  buyertext: string
  vendorText: string
  sellerText: string
}

export interface DisputeForm {
  claimLabel: string
  claimPlaceholder: string
  submitBtnText: string
}

export interface FulfillOrderForm {
  reviewLabel: string
  noteLabel: string
  submitBtnText: string
}

export interface OrderDetails {
  typeLabel: string
  quantityHeader: string
  totalHeader: string
  memoHeader: string
}

export interface StepperTexts {
  pending: string
  paid: string
  accepted: string
  refunded: string
  disputed: string
  expired: string
  decided: string
  resolved: string
  error: string
  fulfilled: string
  completed: string
  canceled: string
}

export interface PaymentQRCard {
  header: string
  walletBtnText: string
  paymentConfirmationText: string
  paymentHelper: string
  confirmBtnText: string
}

export interface PhotoSlideshow {
  dropArea: DropArea
}

export interface DropArea {
  placeholder: string
  selectLabel: string
}

export interface ProfilePage {
  aboutHeader: string
  educationHeader: string
  socialMediaHeader: string
  workHistoryHeader: string
  skillsHeader: string
  othersHeader: string
  competencyHeader: string
  noLocationParagraph: string
  noListingsHeader: string
  redirectSpinnerText: string
  messageBtnText: string
  buyerRatingsHeader: string
  sellerRatingsHeader: string
  tabTitles: TabTitles
  profileNotFoundHeader: string
  profileNotFoundSubText: string
}

export interface TabTitles {
  profile: string
  store: string
  ratings: string
  following: string
  followers: string
  salesHistory: string
  purchaseHistory: string
}

export interface RegistrationPage {
  welcomeHeader: string
  successNotification: string
}

export interface SearchFilters {
  header: string
  checkboxLabel: string
  occupationLabel: string
  priceRangeLabel: string
  ratingsLabel: string
  locationRadiusLabel: string
}

export interface SettingsPage {
  header: string
  spinnerText: string
  changeCredMsgTextA: string
  changeCredMsgTextB: string
  authenticationText: string
  generalNavItem: string
  oldUsernameLabel: string
  oldPasswordLabel: string
  newUsernameLabel: string
  newPasswordLabel: string
  changeCredentialsBtnText: string
  activateAuthenticationBtnText: string
  navItems: SettingsPageNavItems
  profileNavItems: ProfileNavItems
  securityNavItems: SecurityNavItems
  othersNavItems: OthersNavItems
  favoriteModeratorsNavItem: string
  competencyDeleteSuccessNotif: string
  competencyUpdateSuccessNotif: string
  deactivateAuthForm: DeactivateAuthForm
  saveSkillsSuccessNotif: string
  saveSkillsErrorNotif: string
  educationForm: Form
  workForm: Form
  miscForm: MiscForm
  credentialsUpdateSuccessNotif: string
  profileUpdateSuccessNotif: string
  profileSaveSuccessNotif: string
  moderatorSaveSuccessNotif: string
  expiredListingNotif: string
  authUpdateSuccessNotif: string
  blockedNodesCard: BlockedNodesCard
}

export interface BlockedNodesCard {
  emptyContentText: string
  unblockSuccessNotif: string
  unblockErrorNotif: string
}

export interface DeactivateAuthForm {
  helper1: string
  helper2: string
  submitBtnText: string
}

export interface Form {
  addBtnText: string
  updateBtnText: string
}

export interface MiscForm {
  saveSuccessNotif: string
  saveErrorNotif: string
  crashReportLabel: string
  crashReportHelper: string
  autoUpdatesLabel: string
  autoUpdatesHelper: string
}

export interface SettingsPageNavItems {
  profile: string
  moderation: string
  store: string
  security: string
  skills: string
  others: string
}

export interface OthersNavItems {
  blockedPeers: string
  miscellaneous: string
}

export interface ProfileNavItems {
  socialMedia: string
  education: string
  workHistory: string
  addresses: string
  customDescriptions: string
}

export interface SecurityNavItems {
  auth: string
  deactivate: string
}

export interface SocialMediaForm {
  proofPlaceholder: string
  proofTooltip: string
}

export interface TosCard {
  header: string
  expandText: string
}

export interface TosPage {
  header: string
  tos: string
}

export interface UserForm {
  handleLabel: string
  handlePlaceholder: string
  nameLabel: string
  namePlaceholder: string
  emailPlaceholder: string
  fiatCurrencyLabel: string
  cryptoCurrencyLabel: string
  displayCurrencyLabel: string
  languageLabel: string
  unitsLabel: string
}

export interface WalletView {
  transactionSuccessNotif: string
  transactionsText: string
  sentText: string
  receivedText: string
  confirmationsText: string
  balanceText: string
  unconfirmedText: string
  fiatValText: string
  sendText: string
  receiveText: string
  transactionForm: TransactionForm
  receiveTransactionHeader: string
}

export interface TransactionForm {
  addressLabel: string
  amountLabel: string
  noteLabel: string
  submitBtnText: string
}

export interface MobileHeader {
  searchPlaceholder: string
}
