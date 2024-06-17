// import type { Config } from "drizzle-kit";
/** @type { import("drizzle-kit").Config } */
export default {
    dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
    schema: "./utils/schema.js",
    dbCredentials:{
      url:'postgresql://karthiknadar1204:Fvph9DyfVm2L@ep-restless-credit-a1c7489o.ap-southeast-1.aws.neon.tech/IntelliSense?sslmode=require'
    }
  };