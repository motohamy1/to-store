"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";

export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.database,
    appwriteConfig.usersCollection,
    [Query.equal("email", [email])],
  );
  return result.total > 0 ? result.documents[0] : null;
};

export const handleError = async (error: unknown, message: string) => {
  console.error(error, message);
  return null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    console.error("Error sending email OTP:", error);
    return null;
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  console.log("=== Starting createAccount ===");
  console.log("Email:", email);
  console.log("FullName:", fullName);
  
  try {
    // Test basic Appwrite connection
    console.log("Testing Appwrite connection...");
    const { account } = await createAdminClient();
    console.log("Appwrite client created successfully");
    
    // Test OTP sending
    console.log("Attempting to send OTP...");
    const session = await account.createEmailToken(ID.unique(), email);
    console.log("OTP session created:", session.userId);
    
    return parseStringify({ accountId: session.userId });
  } catch (error) {
    console.error("=== Error in createAccount ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    return null;
  }
};

export const verifySecret = async (
  {accountId, password} : {accountId: string, password: string}) => {
      try{
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set('appwrite-session', session.secret, {
          path: '/',
          httpOnly: true,
          secure: true,
        })
        return parseStringify({ sessionId: session.$id})
      } catch(error){
        console.error("Error verifying secret:", error);
        return null;
      }

}
