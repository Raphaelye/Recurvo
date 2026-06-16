import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import adobe from "@/assets/icons/adobe.png";
import back from "@/assets/icons/back.png";
import canva from "@/assets/icons/canva.png";
import claude from "@/assets/icons/claude.png";
import dropbox from "@/assets/icons/dropbox.png";
import figma from "@/assets/icons/figma.png";
import github from "@/assets/icons/github.png";
import home from "@/assets/icons/home.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import setting from "@/assets/icons/setting.png";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";

import uptodate from "@/assets/icons/uptodate.png";
import notfound from "@/assets/icons/notfound.png";
import close from "@/assets/icons/close.png";
import rightarrow from "@/assets/icons/rightarrow.png";
import notification from "@/assets/icons/notification.png";
import barchart from "@/assets/icons/bar-chart.png";
import trend from "@/assets/icons/trend.png";  


export const icons = {
    home,
    wallet,
    setting,
    activity,
    add,
    back,
    menu,
    plus,
    notion,
    dropbox,
    openai,
    adobe,
    medium,
    figma,
    spotify,
    github,
    claude,
    canva,
    notfound,
    close,
    rightarrow,
    notification,
    barchart,
    trend,
    uptodate,
} as const;

export type IconKey = keyof typeof icons;