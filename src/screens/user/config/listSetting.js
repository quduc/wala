import SvgComponent from "@assets/svg";
import * as screenTypes from "@navigation/screenTypes";

export const LIST_SETTING = [
  {
    title: "posts",
    icon: SvgComponent.doc,
    route: screenTypes.MyPosts,
  },
  {
    title: "term",
    icon: SvgComponent.termOfUse,
    route: screenTypes.TermOfUse,
  },
  {
    title: "privacyPolicy",
    icon: SvgComponent.privacy,
    route: screenTypes.PrivacyPolicy,
  },
  {
    title: "aboutUs",
    icon: SvgComponent.aboutUs,
    route: screenTypes.AboutUs,
  },
  {
    title: "contactUs",
    icon: SvgComponent.contactUs,
    route: screenTypes.ContactUs,
  },
  {
    title: "logoutAccount",
    icon: SvgComponent.signOut,
    route: "logoutAccount",
  },
];
