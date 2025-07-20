export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 8,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1RmQzPCd54QIP0qutag9E8vX", // this is for development
        production: "", // missing, needs to be added before going live
      },
    },
  },
];
