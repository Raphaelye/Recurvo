import { icons } from "./icons";
import { image } from "./images";


export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Clever Raph",
    email: "cleveraph27@gmail.com",
};

export const HOME_BALANCE = {
    amount: 0,
    nextRenewalDate: "2026-04-24T09:00:00.000Z",
};



export const HOME_SUBSCRIPTIONS: Subscription[] = [
    {
        id: "adobe-creative-cloud",
        name: "Adobe Creative Cloud",
        plan: "Teams Plan",
        category: "Design",
        paymentMethod: "Visa ending in 8530",
        status: "active",
        startDate: "2026-03-20T10:00:00.000Z",
        price: 90.49,
        currency: "USD",
        billing: "Monthly",
        renewalDate: "2026-03-20T10:00:00.000Z",
    },
    {
        id: "github-pro",
        name: "GitHub Pro",
        plan: "Developer",
        category: "Developer Tools",
        paymentMethod: "Mastercard ending in 2408",
        status: "active",
        startDate: "2024-11-24T10:00:00.000Z",
        price: 9.99,
        currency: "USD",
        billing: "Monthly",
        renewalDate: "2026-03-24T10:00:00.000Z",
    },
    {
        id: "claude-pro",
        name: "Claude Pro",
        plan: "Pro Plan",
        category: "AI Tools",
        paymentMethod: "Amex ending in 1010",
        status: "active",
        startDate: "2025-06-27T10:00:00.000Z",
        price: 20.0,
        currency: "USD",
        billing: "Yearly",
        renewalDate: "2026-03-27T10:00:00.000Z",
    },
    {
        id: "canva-pro",
        name: "Canva Pro",
        plan: "Yearly Access",
        category: "Design",
        paymentMethod: "Visa ending in 7784",
        status: "cancelled",
        startDate: "2024-04-02T10:00:00.000Z",
        price: 119.99,
        currency: "USD",
        billing: "Yearly",
        renewalDate: "2026-04-02T10:00:00.000Z",
    },
];

export const ONBOARDING_DATA: Onboarding[] = [
    {
        id: "1",
        title: "Welcome to Recurvo!",
        description: "Control and track all your subscription payments in one place. No more surprise charges. Make smart decisions and save money with Recurvo.",
        image: image.creditcard,
    },
    {
        id: "2",
        title: "Timely Renewals!!",
        description: "Never miss a renewal date again…Get smart reminders before subscriptions renew, so you can decide to keep, cancel, or swap plans.",
        image: image.reminder,
    },
    {
        id: "3",
        title: "Tailored Insights!!!",
        description: "Identify unused subscriptions and see exactly how much you could save more. Take control of your finances with Recurvo.",
        image: image.insights,
    },
]
