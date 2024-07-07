import { FaHandshake } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { BsLayoutSidebar } from "react-icons/bs";
import { CgDetailsLess } from "react-icons/cg";
import { MdOutlineSchema } from "react-icons/md";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { SlEvent } from "react-icons/sl";
import { GrServices } from "react-icons/gr";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbPageBreak } from "react-icons/tb";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlinePermMedia } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineContacts } from "react-icons/md";
import { MdOutlineFactory } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { BsFiletypeRaw } from "react-icons/bs";
import { HiBarsArrowDown } from "react-icons/hi2";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoPeopleOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { AiOutlineProject } from "react-icons/ai";
import { MdRsvp } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
const SidebarMenuData = [
  {
    id: 0,
    icon: <RxDashboard size={18} />,
    path: "",
    title: "Dashboard",
  },
  {
    id: 1,
    icon: <MdOutlinePermMedia size={18} />,
    path: "media",
    title: "Media",
  },
  {
    id: 2,
    title: "CMS",
    isSubMenus: true,
    menuText: "cmsSubmenu",
    icon: <BsLayoutTextWindowReverse size={20} />,
    subMenus: [
      {
        id: 3,
        title: "Industry",
        isSubSubMenu: true,
        menuText: "IndPageSubmenu",
        icon: <MdOutlineFactory size={18} />,
        subSubMenus: [
          {
            id: 4,
            title: "Industry List",
            path: "cms/industry/industry-list",
            icon: <CgDetailsLess size={18} />,
          },
        ]
      },
      {
        id: 5,
        title: "Home Page",
        isSubSubMenu: true,
        menuText: "homePageSubmenu",
        icon: <IoHomeOutline size={18} />,
        subSubMenus: [
          {
            id: 6,
            title: "Hero",
            path: "cms/home-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 7,
            title: "Industries We Serve",
            path: "cms/home-page/industries-we-serve",
            icon: <MdOutlineFactory size={18} />,
          },
          {
            id: 8,
            title: "What Makes Us Special",
            path: "cms/home-page/what-makes-us-special",
            icon: <GrServices size={18} />,
          },
          {
            id: 9,
            title: "Our Exhibitions",
            path: "cms/home-page/exhibitions",
            icon: <SlEvent size={18} />,
          },
        ]
      },
      {
        id: 10,
        title: "About Page",
        isSubSubMenu: true,
        menuText: "aboutPageSubmenu",
        icon: <CgDetailsMore size={18} />,
        subSubMenus: [
          {
            id: 11,
            title: "Hero",
            path: "cms/about-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 12,
            title: "Our Business",
            path: "cms/about-page/our-business",
            icon: <MdOutlineBusinessCenter size={18} />,
          },
          {
            id: 13,
            title: "Ceo's Message",
            path: "cms/about-page/ceos-message",
            icon: <MdOutlineMessage size={18} />,
          },
          {
            id: 14,
            title: "Organogram",
            path: "cms/home-page/organogram",
            icon: <MdOutlineSchema size={18} />,
          },
        ]
      },
      {
        id: 15,
        title: "Industry Page",
        isSubSubMenu: true,
        menuText: "industryPageSubmenu",
        icon: <MdOutlineFactory size={18} />,
        subSubMenus: [
          {
            id: 16,
            title: "Hero",
            path: "cms/industry-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 17,
            title: "Industry Details",
            path: "cms/industry-page/industry-details",
            icon: <CgDetailsLess size={18} />,
          },
          {
            id: 18,
            title: "Production Process",
            path: "cms/industry-page/production-process",
            icon: <BsLayoutSidebar size={18} />,
          },
          {
            id: 19,
            title: "Reference Layout",
            path: "cms/industry-page/reference-layout",
            icon: <MdOutlineSchema size={18} />,
          },
        ]
      },
      {
        id: 20,
        title: "Service Page",
        isSubSubMenu: true,
        menuText: "servicePageSubmenu",
        icon: <MdOutlineHomeRepairService size={18} />,
        subSubMenus: [
          {
            id: 21,
            title: "Hero",
            path: "cms/service-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 22,
            title: "Services We Provide",
            path: "cms/service-page/service-details",
            icon: <CgDetailsLess size={18} />,
          },
          {
            id: 23,
            title: "Employees",
            path: "cms/service-page/employees",
            icon: <AiOutlineTeam size={18} />,
          },
          {
            id: 24,
            title: "Tickets",
            path: "cms/service-page/tickets",
            icon: <AiOutlineTeam size={18} />,
          },
        ]
      },
      {
        id: 25,
        title: "Raw Materials Page",
        isSubSubMenu: true,
        menuText: "rawMaterialsPageSubmenu",
        icon: <BsFiletypeRaw size={18} />,
        subSubMenus: [
          {
            id: 26,
            title: "Hero",
            path: "cms/raw-materials-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 27,
            title: "raw Materials",
            path: "cms/raw-materials-page/raw-materials",
            icon: <MdOutlineProductionQuantityLimits size={18} />,
          },
        ]
      },
      {
        id: 28,
        title: "Principals Page",
        isSubSubMenu: true,
        menuText: "principalsPageSubmenu",
        icon: <MdOutlineManageAccounts size={18} />,
        subSubMenus: [
          {
            id: 29,
            title: "Hero",
            path: "cms/principals-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 30,
            title: "Principals",
            path: "cms/principals-page/principals",
            icon: <MdOutlineManageAccounts size={18} />,
          },
        ]
      },
      {
        id: 31,
        title: "Customers Page",
        isSubSubMenu: true,
        menuText: "customersPageSubmenu",
        icon: <MdOutlineManageAccounts size={18} />,
        subSubMenus: [
          {
            id: 32,
            title: "Hero",
            path: "cms/customers-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 33,
            title: "Customers",
            path: "cms/customers-page/customers",
            icon: <MdOutlineManageAccounts size={18} />,
          },
        ]
      },
      {
        id: 34,
        title: "Contact Page",
        isSubSubMenu: true,
        menuText: "contactPageSubmenu",
        icon: <MdOutlineContacts size={18} />,
        subSubMenus: [
          {
            id: 35,
            title: "Hero",
            path: "cms/contact-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 36,
            title: "Employees",
            path: "cms/contact-page/employees",
            icon: <MdOutlineManageAccounts size={18} />,
          },
          {
            id: 37,
            title: "Contacts",
            path: "cms/contact-page/contacts",
            icon: <MdOutlineManageAccounts size={18} />,
          },
        ]
      },
      {
        id: 38,
        title: "Career Page",
        isSubSubMenu: true,
        menuText: "careerPageSubmenu",
        icon: <TbPageBreak size={18} />,
        subSubMenus: [
          {
            id: 39,
            title: "Hero",
            path: "cms/career-page/hero",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 40,
            title: "Benefits",
            path: "cms/career-page/benefits",
            icon: <MdOutlineWorkOutline size={18} />,
          },
          {
            id: 41,
            title: "Carrer Openings",
            path: "cms/career-page/carrer-openings",
            icon: <FaHandshake size={18} />,
          },
        ]
      },
      {
        id: 42,
        title: "Security Page",
        isSubSubMenu: true,
        menuText: "securityPageSubmenu",
        icon: <MdOutlineManageAccounts size={18} />,
        subSubMenus: [
          {
            id: 43,
            title: "Terms & Conditions Page",
            path: "cms/security/terms-page",
            icon: <TfiLayoutSliderAlt size={18} />,
          },
          {
            id: 44,
            title: "Privacy Policy Page",
            path: "cms/security/privacy-policy-page",
            icon: <MdOutlineWorkOutline size={18} />,
          },
        ]
      },
      // {
      //   id: 42,
      //   title: "Terms & Conditions Page",
      //   path: "cms/terms-page",
      //   icon: <IoDocumentTextOutline size={18} />,
      // },
      // {
      //   id: 43,
      //   title: "Privacy Policy Page",
      //   path: "cms/privacy-policy-page",
      //   icon: <MdOutlinePrivacyTip size={18} />,
      // },
      {
        id: 45,
        title: "Settings",
        isSubSubMenu: true,
        menuText: "settingsPageSubmenu",
        icon: <AiOutlineSetting size={18} />,
        subSubMenus: [
          {
            id: 46,
            title: "Main Settings",
            path: "cms/settings/main-settings",
            icon: <AiOutlineSetting size={18} />,
          },
          {
            id: 47,
            title: "Footer Links",
            path: "cms/settings/footer",
            icon: <HiBarsArrowDown size={18} />,
          },
        ]
      },
    ],
  },
  {
    id: 48,
    title: "CRM",
    isSubMenus: true,
    menuText: "crmSubmenu",
    icon: <RiCustomerService2Line size={20} />,
    subMenus: [
      {
        id: 49,
        icon: <FiPhone size={18} />,
        path: "crm/contact-list",
        title: "Contact List",
      },
      {
        id: 50,
        icon: <MdOutlineManageAccounts size={18} />,
        path: "crm/customers-list",
        title: "Customers List",
      },
      {
        id: 51,
        icon: <AiOutlineProject size={18} />,
        path: "crm/projects-list",
        title: "Projects List",
      },

      {
        id: 52,
        icon: <FaTasks size={18} />,
        path: "crm/tasks-list",
        title: "Tasks List",
      },
      {
        id: 53,
        title: "RFQ",
        isSubSubMenu: true,
        menuText: "rfqSubmenu",
        icon: <IoDocumentAttachOutline size={18} />,
        subSubMenus: [
          {
            id: 54,
            title: "RFQ Types",
            path: "crm/rfq/rfq-types",
            icon: <FiEdit size={18} />,
          },
          {
            id: 55,
            title: "RFQ List",
            path: "crm/rfq/rfq-list",
            icon: <MdRsvp size={18} />,
          },
        ]
      },
    ],
  },
  {
    id: 56,
    title: "HRM",
    isSubMenus: true,
    menuText: "hrmSubmenu",
    icon: <IoPeopleOutline size={20} />,
    subMenus: [
      {
        id: 57,
        icon: <AiOutlineTeam size={18} />,
        path: "hrm/hrm-employees",
        title: "Employees",
      },
    ],
  },
];
export default SidebarMenuData;
