export const metadata = {
  title: "Privacy Policy",
  description: "How SunCart handles account and browsing information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 prose prose-gray max-w-none">
        <h1 className="text-3xl font-extrabold text-gray-800">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: August 22, 2026</p>

        <h2>Information we collect</h2>
        <p>
          SunCart collects the information you provide when you create an account, including your name, email address, password, and optional profile photo URL. The service also receives basic session and security information required to keep your account signed in.
        </p>

        <h2>How we use information</h2>
        <p>
          Account information is used to authenticate you, maintain your profile, protect the service, and provide the features you request. SunCart does not sell personal information.
        </p>

        <h2>Data retention and security</h2>
        <p>
          Account data is stored in the service database and retained while your account is active or as needed to operate and secure the service. Passwords are handled by the authentication service and are not stored as plain text.
        </p>

        <h2>Your choices</h2>
        <p>
          You can update your display name and profile photo URL from your profile page. For questions about access or deletion, contact <a href="mailto:support@suncart.com">support@suncart.com</a>.
        </p>
      </article>
    </main>
  );
}
