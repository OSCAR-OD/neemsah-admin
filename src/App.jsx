import { Route, Routes } from "react-router-dom";
/// import 'react-phone-number-input/style.css';
import "react-phone-input-2/lib/style.css";
import "./App.css";
import "./Style/Services.css";
import "./Style/Home.css";
import "./Style/Category.css";
import "./Style/ErpServices.css";
import { lazy, Suspense } from "react";
const Layout = lazy(() => import("./Layout/Layout"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const ClientsPage = lazy(() => import("./Pages/Home/Clients/ClientsPage"));
const TicketsPage = lazy(() => import("./Pages/Service/Tickets/TicketsPage"));
const HeroListPage = lazy(() => import("./Pages/Home/Hero/HeroListPage"));
const AboutHeroPage = lazy(() => import("./Pages/About/Hero/AboutHeroPage"));
const SpecialListPage = lazy(() => import("./Pages/Home/Special/SpecialListPage"));
const IndustriyServeListPage = lazy(() => import("./Pages/Home/Industry/IndustriesWeServeListPage"));
const ExhibitionListPage = lazy(() => import("./Pages/Home/Exhibition/ExhibitionListPage"));
const IndustryListPage = lazy(() => import("./Pages/Industry/Industry/IndustryListPage"));
const BusinessListPage = lazy(() => import("./Pages/About/Business/BusinessListPage"));
const MessageListPage = lazy(() => import("./Pages/About/Message/MessageListPage"));
const OrganogramListPage = lazy(() => import("./Pages/About/Organogram/OrganogramListPage"));
const ServiceHeroPage = lazy(() => import("./Pages/Service/Hero/ServiceHeroPage"));
const EmployeeListPage = lazy(() => import("./Pages/Service/Employee/EmployeeListPage"));
const ServiceListPage = lazy(() => import("./Pages/Service/Services/ServiceListPage"));
const ContactHeroPage = lazy(() => import("./Pages/Contact/Hero/ContactHeroPage"));
const ContactsPage = lazy(() => import("./Pages/Contact/Contacts/ContactsPage"));
const CEmployeeListPage = lazy(() => import("./Pages/Contact/Employee/EmployeeListPage"));
const RawmHeroPage = lazy(() => import("./Pages/Rawm/Hero/RawmHeroPage"));
const RawMaterialsListPage = lazy(() => import("./Pages/Rawm/RawMaterials/RawMaterialsListPage"));
const PrincipalsHeroListPage = lazy(() => import("./Pages/Principal/Hero/PrincipalsHeroListPage"));
const PrincipalsListPage = lazy(() => import("./Pages/Principal/Principals/PrincipalsListPage"));
const CustomersHeroListPage = lazy(() => import("./Pages/Customer/Hero/CustomersHeroListPage"));
const CustomersListPage = lazy(() => import("./Pages/Customer/Customers/CustomersListPage"));
const FooterListPage = lazy(() => import("./Pages/Settings/Footer/FooterPageList"));
const HrmEmployeeListPage = lazy(() => import("./Pages/HRM/Employee/EmployeeListPage"));
const CrmContactListPage = lazy(() => import("./Pages/CRM/Contact/ContactListPage"));
const CrmCustomersListPage = lazy(() => import("./Pages/CRM/Customers/CustomersListPage"));
const CrmProjectsListPage = lazy(() => import("./Pages/CRM/Projects/ProjectsListPage"));
const CrmRfqTypeList = lazy(() => import("./Pages/CRM/RFQ/RfqTypeList"));
const CrmRSVPPage = lazy(() => import("./Pages/CRM/RFQ/RSVPPage"));
const CrmRfqListPage = lazy(() => import("./Pages/CRM/RFQ/RfqListPage"));
const TasksListPage = lazy(() => import("./Pages/CRM/Tasks/TasksListPage"));
const MainSettingsPage = lazy(() => import("./Pages/Settings/MainSettings/MainSettingsPage"));
const IndustryFormAdd = lazy(() => import("./Pages/Navbar/IndustryFormAdd"));
const CareerHeroPage = lazy(() => import("./Pages/Career/Hero/CareerHeroPage"));
const AddNavbarPage = lazy(() => import("./Pages/Navbar/AddNavbarPage"));
const MediaList = lazy(() => import("./Pages/Media/MediaList"));
const SeoHomePage = lazy(() => import("./Pages/Home/Seo/SeoHomePage"));
const LoginPage = lazy(() => import("./Pages/Login/LoginPage"));
const ForgetPasswordPage = lazy(() => import("./Pages/ForgetPassword/ForgetPasswordPage"));
const OtpPage = lazy(() => import("./Pages/Otp/OtpPage"));
const ChangePasswordPage = lazy(() =>  import("./Pages/ChangePassword/ChangePasswordPage"));
const ProviderWrapper = lazy(() => import("./Provider/ProviderWrapper"));
const UnauthorizePage = lazy(() => import("./Pages/Unauthorize/UnauthorizePage"));
const FaqPage = lazy(() => import("./Pages/FaqPage/Faq/FaqPage"));
const SingleIndustryPage = lazy(() => import('./Pages/Industry/Industry/SingleIndustryPage'));
const SalesDashboard = lazy(() => import("./Pages/SalesEmployee/SalesDashboard"));
const ViewDailyVisitReportPage = lazy(() => import("./Pages/SalesEmployee/ViewDailyVisitReportPage"));
const SalesEmployeeTasks = lazy(() => import("./Pages/SalesEmployee/SalesEmployeeTasks"));
const SalesEmployeeDailyVisit = lazy(() => import("./Pages/SalesEmployee/SalesEmployeeDailyVisit"));
const CreateDailyVisitReportPage = lazy(() => import("./Pages/SalesEmployee/CreateDailyVisitReportPage"));


const LoadingPage = lazy(() => import("./Components/Loader/LoadingPage"));
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ProviderWrapper>
      <Routes>
        {/* Login page Router  */}
        <Route path="login" element={ <Suspense fallback={<LoadingPage />}> <LoginPage /> </Suspense> } />
        <Route path="forget-password" element={ <Suspense fallback={<LoadingPage />}> <ForgetPasswordPage /> </Suspense> } />
        <Route  path="otp"  element={ <Suspense fallback={<LoadingPage />}> <OtpPage /> </Suspense> } />
        <Route path="change-password" element={ <Suspense fallback={<LoadingPage />}> <ChangePasswordPage /> </Suspense> } />
        <Route path="unauthorized" element={ <Suspense fallback={<LoadingPage />}> <UnauthorizePage /> </Suspense> } />
        <Route path="*" element={  <Suspense fallback={<LoadingPage />}> <NotFound />  </Suspense> } />
        <Route path="/" element={  <Suspense fallback={<LoadingPage />}>  <Layout /> </Suspense> } >
          {/* Dashboard page Router  */}
          <Route index element={<Dashboard />} />
          {/* Media page Router  */}
          <Route path="media" element={<MediaList />} />
          {/* Industry page Router  */}
          <Route path="cms/industry/industry-list" element={<IndustryListPage />} />
          <Route path="cms/industry/industry-list/single/:id" element={<SingleIndustryPage />} />
          
          {/* Home page Router  */}
          <Route path="cms/home-page/hero" element={<HeroListPage />} />
          <Route path="cms/home-page/industries-we-serve" element={<IndustriyServeListPage />} />
          <Route path="cms/home-page/what-makes-us-special" element={<SpecialListPage />} />
          <Route path="cms/home-page/exhibitions" element={<ExhibitionListPage />} />
          {/* About page Router  */}
          <Route path="cms/about-page/hero" element={<AboutHeroPage />} />
          <Route path="cms/about-page/our-business" element={<BusinessListPage />} />
          <Route path="cms/about-page/ceos-message" element={<MessageListPage />} />
          <Route path="cms/about-page/ceos-message" element={<MessageListPage />} />
          <Route path="cms/home-page/organogram" element={<OrganogramListPage />} />
          {/* Service page Router  */}
          <Route path="cms/service-page/hero" element={<ServiceHeroPage />} />
          <Route path="cms/service-page/employees" element={<EmployeeListPage />} />
          <Route path="cms/service-page/tickets" element={<TicketsPage />} />
          <Route path="cms/service-page/service-details" element={<ServiceListPage />} />
          {/* Contact page Router  */}
          <Route path="cms/contact-page/hero" element={<ContactHeroPage />} />
          <Route path="cms/contact-page/contacts" element={<ContactsPage />} />
          <Route path="cms/contact-page/employees" element={<CEmployeeListPage />} />
          {/* Raw Materials page Router  */}
          <Route path="cms/raw-materials-page/hero" element={<RawmHeroPage />} />
          <Route path="cms/raw-materials-page/raw-materials" element={<RawMaterialsListPage />} />
          {/* Principals page Router  */}
          <Route path="cms/principals-page/hero" element={<PrincipalsHeroListPage />} />
          <Route path="cms/principals-page/principals" element={<PrincipalsListPage />} />
          {/* Customers page Router  */}
          <Route path="cms/customers-page/hero" element={<CustomersHeroListPage />} />
          <Route path="cms/customers-page/customers" element={<CustomersListPage />} />
          {/* Career page Router  */}
          <Route path="cms/career-page/hero" element={<CareerHeroPage />} />
          {/* CRM Router  */}
          <Route path="crm/contact-list" element={<CrmContactListPage />} />
          <Route path="crm/customers-list" element={<CrmCustomersListPage />} />
          <Route path="crm/projects-list" element={<CrmProjectsListPage />} />
          <Route path="crm/rfq/rfq-types" element={<CrmRfqTypeList />} />
          <Route path="crm/rfq/rfq-types/single/:id" element={<CrmRSVPPage />} />
          <Route path="crm/rfq/rfq-list" element={<CrmRfqListPage />} />
          <Route path="crm/tasks-list" element={<TasksListPage />} />
          {/* HRM Router  */}
          <Route path="hrm/hrm-employees" element={<HrmEmployeeListPage />} />
          {/* Sales Employee  */}
          <Route path="salesDashboard" element={<SalesDashboard />} />
          <Route path="salesDashboard/daily-visit" element={<SalesEmployeeDailyVisit />} />
          <Route path="salesDashboard/daily-visit/create-report" element={<CreateDailyVisitReportPage />} />          
          <Route path="salesDashboard/daily-visit/submit/:cid/:pid" element={<ViewDailyVisitReportPage />} />
          <Route path="salesDashboard/tasks" element={<SalesEmployeeTasks />} />
          
          
          
          
          {/* navbar */}
          {/* <Route path="cms/navbar/industries" element={<IndustryListPage />} />
          <Route path="cms/navbar/industries/industry-form" element={<IndustryFormAdd />} /> */}

          {/* Faq  page Router  */}
          <Route path="faq" element={<FaqPage />} />

          {/* Settings  page Router  */}
          <Route path="cms/settings/footer" element={<FooterListPage />} />
          <Route path="cms/settings/main-settings" element={<MainSettingsPage />} />
          
        </Route>
      </Routes>
      <ToastContainer
        autoClose={5000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </ProviderWrapper>
  );
}

export default App;
