import { getMessages } from "next-intl/server";

export async function generateMetadata({ locale, title, description = "" }) {
  const messages = await getMessages(locale);

  const titleKey = messages[title];
  const descriptionKey = messages[description] || "";

  return {
    title: `${titleKey || title} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: descriptionKey || description,
  };
}
