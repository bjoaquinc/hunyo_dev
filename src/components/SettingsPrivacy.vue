<template>
  <div style="height: 100%">
    <q-card
      class="full-width flex justify-between q-py-sm q-px-sm bg-grey-1"
      flat
      bordered
    >
      <q-btn
        color="secondary"
        icon="fas fa-chevron-left"
        dense
        flat
        :to="{ path: '/settings' }"
      />
      <div class="text-h6">Privacy Policy</div>
      <div style="width: 28px; height: 28px" />
    </q-card>
    <div
      class="flex q-px-md q-py-lg"
      style="flex-wrap: wrap !important; overflow: auto"
      :style="{
        maxHeight:
          q.platform.is.mobile && !q.platform.is.ipad ? '90vh' : '70vh',
      }"
    >
      <div class="text-h4 q-pb-lg">Privacy Policy</div>
      <div class="text-h5 q-mt-md">1. Information You Share With Us</div>
      <div class="q-mt-md">
        We require certain information to provide our services to you. For
        example, you must have an account in order to upload or share content on
        Hunyo. When you choose to share the information below with us, we
        collect and use it to operate our services.
      </div>
      <div class="text-h5 q-mt-md">1.1 Basic Account Information</div>
      <div class="q-mt-md">
        You don’t have to create an account to use some of our service features,
        such as searching and viewing Hunyo posts. If you do choose to create an
        account, you must provide us with some personal data so that we can
        provide our services to you. On Hunyo this includes a display name (for
        example, “Hunyo Design”), a username (for example, @HunyoDesign), a
        password, and an email address or phone number. You may provide us with
        additional information, including location (city and country), business
        address, and Viber number. Your display name, user name, location and
        address will always be public.
      </div>
      <div class="text-h5 q-mt-md">1.2 Public Information</div>
      <div class="q-mt-md">
        Most activity on Hunyo is public, including your profile information and
        your posts. When you share audio or visual content on our service we may
        analyze that data to operate our services, for example by providing
        audio transcription. The recommendations, comments and replies you make;
        comments and replies others make on your posts; people you follow and
        who follow you; the activity on your profile page; and your folder are
        visible to all registered Hunyo members, Hunyo founders, Hunyo employees
        and Hunyo partners. If you rate, comment, download content or otherwise
        engage with an ad or supplier on our services, that advertiser or
        supplier might thereby learn information about you associated with the
        content with which you engaged such as characteristics of the audience
        the content was intended to reach. Any engagement with another account’s
        posts or content will remain part of that content for as long as it
        remains on our services. You are responsible for your posts and other
        information you provide through our services, and you should think
        carefully about what you post, especially if it is sensitive
        information. If you update your public information on Hunyo, such as by
        deactivating your account, we will reflect your updated content on
        hunyo.com.
      </div>
      <div class="text-h5 q-mt-md">
        1.3 Contact Information and Address Books
      </div>
      <div class="q-mt-md">
        We use your contact information, such as your email address or phone
        number, to authenticate your account and keep it - and our services -
        secure, and to help prevent spam, fraud, and abuse. Subject to your
        settings, we also use contact information to enable certain account
        features (for example, for login verification), to send you information
        about our services, and to personalize our services, including ads. If
        you provide us with your phone number, you agree to receive messages
        from Hunyo to that number as your country’s laws allow.<br />
        <br />
        Hunyo also uses your contact information to market to you as your
        country’s laws allow, and to help others find your account if your
        settings permit, including through third-party services and client
        applications. You can use your settings for email and mobile
        notifications to control notifications you receive from Hunyo. You can
        also unsubscribe from a notification by following the instructions
        contained within the notification or **here.***<br />
        <br />
        You can choose to upload and sync your address book on Hunyo so that we
        can help you find and connect with people you know and help others find
        and connect with you. We also use this information to better recommend
        content to you and others.<br />
        <br />
        If you email us, we will keep the content of your message, your email
        address, and your contact information to respond to your request.
      </div>
      <div class="text-h5 q-mt-md">
        1.4 How You Control the Information You Share with Us ****
      </div>
      <div class="q-mt-md">
        Your ***Privacy and safety settings** let you decide (Privacy and safety
        should link to the section on settings where you can directly control
        this action. refer to hyperlink in twitter)<br />
        <br />
        *Whether others can find you based on your email or phone number<br />
        <br />
        *Whether you upload your address book to Hunyo for storage and use
      </div>
      <div class="text-h5 q-mt-md">
        2. Additional Information We Receive About You
      </div>
      <div class="q-mt-md">
        We receive certain information when you use our services or other
        websites or mobile applications that include our content, and from third
        parties including advertisers. Like the information you share with us,
        we use the data below to operate our services.
      </div>
      <div class="text-h5 q-mt-md">2.1 Location Information</div>
      <div class="q-mt-md">
        We require information about your signup and current location, which we
        get from signals, such as your IP address or device settings, to
        securely and reliably set up and maintain your account and to provide
        our services to you.<br />
        <br />
        Subject to your settings, we may collect, use, and store additional
        information about your location, such as your current precise position
        or places where you’ve previously used Hunyo - to operate or personalize
        our services including with more relevant content like ads, and
        suggestions for people to follow.
      </div>
      <div class="text-h5 q-mt-md">2.2 Links</div>
      <div class="q-mt-md">
        In order to operate our services, we keep track of how you interact with
        links across our services. This includes links in emails we send you and
        links in Hunyo posts that appear on other websites or mobile
        applications.<br />
        <br />
        If you click on an external link or ad on our services, that advertiser
        or website operator might figure out that you came from Hunyo along with
        other information associated with the ad you clicked such as
        characteristics of the audience it was intended to reach. They may also
        collect other personal data from you, such as cookie identifiers or your
        IP address.
      </div>
      <div class="text-h5 q-mt-md">2.3 Cookies</div>
      <div class="q-mt-md">
        A cookie is a small piece of data that is stored on your computer or
        mobile device. Like many websites, we use cookies and similar
        technologies to collect additional website usage data and to operate our
        services. Cookies are not required for many parts of our services such
        as searching and looking at public profiles. Although most web browsers
        automatically accept cookies, many browsers’ settings can be set to
        decline cookies or alert you when a website is attempting to place a
        cookie on your computer. However, some of our services may not function
        properly if you disable cookies. When your browser or device allows it,
        we use both session cookies and persistent cookies to better understand
        how you interact with our services, to monitor aggregate usage patterns,
        and to personalize and otherwise operate our services such as by
        providing account security, personalizing the content we show you
        including ads, and remembering your language preferences. We do not
        support the Do Not Track browser option.
      </div>
      <div class="text-h5 q-mt-md">2.4 Log Data</div>
      <div class="q-mt-md">
        We receive information when you view content on or otherwise interact
        with our services, which we refer to as “Log Data,” even if you have not
        created an account. For example, when you visit our websites, sign into
        our services, interact with our email notifications, or visit a
        third-party service that includes Hunyo content, we may receive
        information about you. This Log Data includes information such as your
        IP address, browser type, operating system, the referring web page,
        pages visited, location, your mobile carrier, device information
        (including device and application IDs), search terms (including those
        not submitted as queries), and cookie information. We also receive Log
        Data when you click on, view, or interact with links on our services. We
        use Log Data to operate our services and ensure their secure, reliable,
        and robust performance. For example, we use Log Data to protect the
        security of accounts and to determine what content is popular on our
        services. We also use this data to improve the content we show you,
        including ads and to improve the effectiveness of our own marketing.<br />
        <br />
        We use information you provide us and data we receive, including Log
        Data and data from third parties to make inferences like what topics you
        may be interested in, how old you are, and what languages you speak.
        This helps us better promote and design our services for you and
        personalize the content we show you, including ads.
      </div>
      <div class="text-h5 q-mt-md">2.5 Advertisers and Other Ad Partners</div>
      <div class="q-mt-md">
        Advertising revenue allows us to support and improve our services. We
        use the information described in this Privacy Policy to help make our
        advertising more relevant to you, to measure its effectiveness, and to
        help recognize your devices to serve you ads on and off of Hunyo. Our ad
        partners and affiliates share information with us, such as browser
        cookie IDs, mobile device IDs, hashed email addresses, demographic or
        interest data and content viewed or actions taken on a website or
        app.<br />
        <br />
        If you are an advertiser or a prospective advertiser, we process your
        personal data to help offer and provide our advertising services. You
        can update your data by contacting us directly as described in this
        Privacy Policy.
      </div>
      <div class="text-h5 q-mt-md">2.6 Other Third Parties and Affiliates</div>
      <div class="q-mt-md">
        We may receive information about you from third parties who are not our
        ad partners, such as others on Hunyo, partners who help us evaluate the
        safety and quality of content on our platform, and other services you
        link to your Hunyo account.
      </div>
      <div class="text-h5 q-mt-md">
        2.7 Personalizing Based on your Inferred Identity
      </div>
      <div class="q-mt-md">
        When you log into Hunyo on a browser or device, we will associate that
        browser or device with your account for purposes such as authentication,
        security, and personalization. Subject to your settings, we may also
        associate your account with browsers or devices other than those you use
        to log into Hunyo (or associate your logged-out device or browser with
        other browsers or devices). When you provide other information to Hunyo,
        including an email address, we associate that information with your
        Hunyo account. Subject to your settings, we may also use this
        information in order to infer other information about your identity, for
        example by associating your account with hashes of email addresses that
        share common components with the email address you have provided to
        Hunyo. We do this to operate and personalize our services. For example,
        if the email address associated with your account shares components with
        another email address, such as shared first name, last name, or
        initials, we may later match advertisements to you from advertisers that
        were trying to reach email addresses containing those components.
      </div>
      <div class="text-h5 q-mt-md">3. Information We Share and Disclose</div>
      <div class="q-mt-md">
        As noted above, Hunyo is designed to broadly and instantly disseminate
        information you share publicly through our services. In the limited
        circumstances where we disclose your private personal data, we do so
        subject to your control, because it’s important for operating our
        services, or because it’s required by law.
      </div>
      <div class="text-h5 q-mt-md">3.1 Share your Control</div>
      <div class="q-mt-md">
        We share or disclose your personal data with your consent or at your
        direction, such as when you direct us to share your feedback with a
        business. We also provide certain third parties with personal data to
        help us offer or operate our services.
      </div>
      <div class="text-h5 q-mt-md">3.2 Service Providers</div>
      <div class="q-mt-md">
        We engage service providers to perform functions and provide services
        for us in Singapore, the Philippines and other countries. For example,
        we use a variety of third-party services to help us understand the use
        of our services, such as Google Analytics. We may share your private
        personal data with such service providers subject to obligations
        consistent with this Privacy Policy and any other appropriate
        confidentiality and security measures, and on the condition that the
        third parties use your private personal data only on our behalf and
        pursuant to our instructions (service providers may use other
        non-personal data for their own benefit).<br />
        <br />
        We use third-party services for:<br />
        <br />
        *Analytics tracking<br />
        *User authentication<br />
        *Forms processing<br />
        *Advertising and promotion<br />
        *Content marketing<br />
        *Email marketing<br />
        *Payment processing
      </div>
      <div class="text-h5 q-mt-md">3.3 Law, Harm and the Public Interest</div>
      <div class="q-mt-md">
        Notwithstanding anything to the contrary in this Privacy Policy or
        controls we may otherwise offer to you, we may preserve, use, share, or
        disclose your personal data or other safety data if we believe that it
        is reasonably necessary to comply with a law, regulation, legal
        processes, or government request; to protect the safety of any person;
        to protect the safety or integrity of our platform, including to help
        prevent spam, abuse, or malicious actors on our services, or to explain
        why we have removed content or accounts from our services; to address
        fraud, security, or technical issues; or to protect our rights or
        property or the rights or property of those who use our services.
        However, nothing in this Privacy Policy is intended to limit any legal
        defenses or objections that you may have to a third party’s, including a
        government’s, request to disclose your personal data.
      </div>
      <div class="text-h5 q-mt-md">3.4 Change of Ownership</div>
      <div class="q-mt-md">
        In the event that we are involved in a bankruptcy, merger, acquisition,
        reorganization, or sale of assets, your personal data may be sold or
        transferred as part of that transaction. This Privacy Policy will apply
        to your personal data as transferred to the new entity.
      </div>
      <div class="text-h5 q-mt-md">3.5 Non-Personal Information</div>
      <div class="q-mt-md">
        We share or disclose non-personal data, such as aggregated information
        like the total number of times people engaged with a Hunyo post,
        demographics, the number of people who clicked on a particular link, the
        topics or keywords that people are posting about in a particular
        location, some inferred interests, or reports to advertisers or
        suppliers about how many people saw, rated, commented, clicked on,
        downloaded or otherwise engaged with their ads or content.
      </div>
      <div class="text-h5 q-mt-md">
        4. Managing Your Personal Information With Us
      </div>
      <div class="q-mt-md">
        You control the personal data you share with us. You can access or
        rectify this data at any time. You can also deactivate your account.
        Please note, to help protect your privacy and maintain security, we take
        steps to verify your identity before granting you access to your
        personal information or complying with deletion or other related
        requests.
      </div>
      <div class="text-h5 q-mt-md">
        4.1 Accessing or Rectifying Your Personal Data
      </div>
      <div class="q-mt-md">
        If you have registered an account on Hunyo, we provide you with tools
        and account settings to access, correct, delete, or modify the personal
        data you provided to us and associated with your account. To submit a
        request related to access, modification, or deletion of your
        information, or someone else’s information if you are their authorized
        agent, you may contact us at hello@hunyo.com. We may require you to
        provide additional information for verification.
      </div>
      <div class="text-h5 q-mt-md">4.2 Deletion</div>
      <div class="q-mt-md">
        If you would like to deactivate your Hunyo account, message us at
        hello@hunyo.com.<br />
        <br />
        When deactivated, your Hunyo account, including your display name,
        username, and public profile, will no longer be viewable on Hunyo.com.
        For up to 30 days after deactivation it is still possible to restore
        your Hunyo account if it was accidentally or wrongfully deactivated.<br />
        <br />
        Keep in mind that your Hunyo posts, comments, recommendations and
        reviews will still be viewable on Hunyo.com, but the aforementioned
        information will be anonymized and in no way will be associated with
        your deactivated public profile. Also, search engines and other third
        parties may still retain copies of your public information, like your
        profile information and Hunyo posts, even after you have deleted the
        information from our services or deactivated your account.
      </div>
      <div class="text-h5 q-mt-md">
        4.3 Additional Information or Assistance
      </div>
      <div class="q-mt-md">
        Thoughts or questions about this Privacy Policy? Please let us know by
        messaging us at hello@hunyo.com.
      </div>
      <div class="text-h5 q-mt-md">5. Children and Use of Our Services</div>
      <div class="q-mt-md">
        Our services are not directed to children and you may not use our
        services if you are under the age of 16 years old.
      </div>
      <div class="text-h5 q-mt-md">
        6. Our International Operations and Data Transfers
      </div>
      <div class="q-mt-md">
        To bring you our services, we operate internationally. Where the laws of
        your country allow you to do so, you authorize us to transfer, store,
        and use your data in Singapore and any other country where we operate.
        In some of the countries to which we transfer personal data, the privacy
        and data protection laws and rules regarding when government authorities
        may access data may vary from those of your country.<br />
        <br />
        When we transfer personal data outside of Singapore, we ensure an
        adequate level of protection for the rights of data subjects based on
        the adequacy of the receiving country’s data protection laws and/or
        contractual obligations placed on the recipient of the data.<br />
        <br />
        If you have a privacy related complaint, please email us at
        hello@hunyo.com and we will seek to resolve it through our internal
        complaint resolution process.
      </div>
      <div class="text-h5 q-mt-md">7. Changes to This Privacy Policy</div>
      <div class="q-mt-md">
        We may revise this Privacy Policy from time to time. The most current
        version of the policy will govern our processing of your personal data
        and will always be at **hunyo.com/privacy.** If we make a change to this
        policy that, in our sole discretion, is material, we will notify you
        within Hunyo.com or by sending an email to the email address associated
        with your account. By continuing to access or use the Services after
        those changes become effective, you agree to be bound by the revised
        Privacy Policy.<br />
        <br />
        <span><div class="text-weight-bold">Effective:</div></span> January 1st,
        2022
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  setup() {
    const q = useQuasar();

    return {
      q,
    };
  },
};
</script>
