export const metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the SunCart storefront.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 prose prose-gray max-w-none">
        <h1 className="text-3xl font-extrabold text-gray-800">Terms of Service</h1>
        <p className="text-gray-500">Last updated: August 22, 2026</p>

        <h2>Using SunCart</h2>
        <p>
          SunCart provides a summer essentials catalog and account features for personal use. You agree to provide accurate account information, keep your credentials private, and use the service lawfully.
        </p>

        <h2>Product information</h2>
        <p>
          Product descriptions, prices, ratings, and availability are presented for demonstration purposes and may change. The current storefront does not process orders or payments; the disabled cart action is intentionally not a checkout promise.
        </p>

        <h2>Accounts</h2>
        <p>
          You are responsible for activity performed through your account. SunCart may suspend access when necessary to protect users, the service, or its security.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a href="mailto:support@suncart.com">support@suncart.com</a>.
        </p>
      </article>
    </main>
  );
}
