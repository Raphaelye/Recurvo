import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import back from "@/assets/icons/back.png";
import home from "@/assets/icons/home.png";
import menu from "@/assets/icons/menu.png";
import plus from "@/assets/icons/plus.png";
import setting from "@/assets/icons/setting.png";
import wallet from "@/assets/icons/wallet.png";
import uptodate from "@/assets/icons/uptodate.png";
import notfound from "@/assets/icons/notfound.png";
import close from "@/assets/icons/close.png";
import rightarrow from "@/assets/icons/rightarrow.png";
import notification from "@/assets/icons/notification.png";
import barchart from "@/assets/icons/bar-chart.png";
import trend from "@/assets/icons/trend.png";
import bin from "@/assets/icons/bin.png";  
import edit from "@/assets/icons/edit.png";
import calendar from "@/assets/icons/calendar.png";
import archive from "@/assets/icons/archive.png";
import spotify from "@/assets/icons/spotify.png";
export const icons = {
    home,
    wallet,
    setting,
    activity,
    add,
    back,
    menu,
    plus,
    notfound,
    close,
    rightarrow,
    notification,
    barchart,
    trend,
    uptodate,
    bin,
    edit,
    calendar,
    archive,
    spotify,
} as const;

export type IconKey = keyof typeof icons;