export type Result = {
  subscriptionName: string;
  companyName: string;
  type: "monthly" | "yearly";
  price: number;
  renewDate: string;
};
