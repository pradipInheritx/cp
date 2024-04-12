import { ContentPage } from "../../Contexts/ContentContext";
// import GameRule from "../../Pages/GameRule";

const headers = [
  "What is the purpose of the Coin Parliament?",
  "What kind of skills or knowledge do I need to become a Parliament member?",
  "What is the Coin Parliament voting indicator (CPVI)|?",
  "Is it 100% safe to depend on my investments/trades on the (CPVI)|?",
  "Why should I share my votes?",
  "Why should we invite friends to the Parliament?",
  "What is pool mining ?",
  "Why should you take it seriously before you vote?",
  "Why should I share my votes?",
  "What is a PAX token?",
  "Why should I make the effort to earn PAX?",
  "What is mining?",
  "What is the status of Parliament members?",
];

const body = [
  "Coin Parliament Bigger Parliament means more accurate results and better success rates in trading and investments for the Parliament members.",
  " Coin Parliament was created for all users from beginner to professional ",
  " The Coin Parliament Voting Indicator (CPVI)  used to measure the success rate and volume of votes on the Coin Parliament platform. \n              The CPVI is displayed as an oscillator (a line graph that moves between two extremes) and can have a reading from 0 to 100.\n              Values above 50 indicate that more users voted “BULL” meaning more people are going to buy this coin.\n              Values below 50 indicate that more users voted “BEAR” meaning more people are going to sell this coin. ",
  " No, never depend any of your financial investments or trades on other people, platforms, advisors opinions. Always do your research and don’t risk what you can’t allow to lose ",
  "Sharing your votes on social media such as Facebook, Twitter, Whatsapp can help the Parliament to get and show more accurate  results for the CPVI and increase your pool earnings.",
  " When you invite friends to the Parliament you are creating your own pool and your friends voting increases your CPM and your earning! The more friends you invite the more coins you can earn. ",
  "Pool mining is the group of your friends you invited to the Parliament. Your friends voting is your pool mining ",
  " Voting correctly will give you a better score and you will be rewarded with more CPM that will help you to earn more PAX and you will get a higher rank as a Parliament member. ",
  "Sharing your votes on social media such as Facebook, Twitter, Whatsapp can help the Parliament to get and show more accurate  results for the CPVI and increase your pool earnings.",
  "PAX is a BEP based token ",
  "PAX token got value in the market and as soon as the Parliament PAX mint reaches 50% of the total minting it will be listed in exchange and you will be able to trade it. ",
  " Mining in the Parliament means voting. Voting for more coins and pairs will increase your earnings ",
  " Each and every member of Coin Parliament got a status. Check the table for status and CPM for each status. PLEASE NOTE your Parliament status is dynamic and it depends on your voting success. You can climb up and down in your status depending on your voting success rate. \n              \n\t\t\t\t\n\t\t\t\t\tMinister - 5 I am on top of the world\n\t\t\t\t\tAmbassador - 4 If your dreams don't scare you, they aren’t big enough\n\t\t\t\t\tConsul - 3 Don’t just talk about it BE ABOUT IT!\n\t\t\t\t\tSpeaker - 2 Hard work is a two-way street, You get back exactly what you put in.\n\t\t\t\t\tMember- 1It’s just the beginning - I am here to stay\n\t\t\t\t\t\n\t\t\t\t\n            ",
];

export const faq = headers.map((h, i) => {
  return {
    title: headers[i].trim(),
    content: body[i].trim(),
  };
});

const about =
  "Coin Parliament aims to provide a community environment where all of our users can share their opinions and vote freely and learn from each other. Everyone is welcome to come to our platform and provide insightful, delightful and informative thoughts, but we also hope to provide a space where everyone respects each other without spam, abuse or promotional messages. We want all users to feel comfortable and safe being in the space. Therefore, we are setting up some community rules to define what is acceptable and what is not — all users are expected to follow our community guidelines!\n\nWhoever fails to follow our rules will have their messages deleted, and further action taken if necessary. Coin Parliament could temporarily or permanently suspend accounts from being able to post, comment, repost or share any messages from the Coin Parliament discussion feature if community rules are repeatedly violated.";

export const privacy = `<p><strong>I. Privacy Policy </strong><br />&nbsp;<br />1. CoinParliament.com and its affiliates (collectively, &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) create, publish, and<br />run social games for web and mobile environments (collectively,&quot;games&quot;), as well as web and<br />mobile applications (each, an&quot;App&quot;) for playing our games on many devices and platforms.<br />&nbsp;<br />2. CoinParliament.com is dedicated to safeguarding your privacy and individually identifiable<br />information (&quot;Personal Information&quot;).<br />&nbsp;<br />3. This Privacy Policy was created to inform you about the types of personal information we (or<br />anyone acting on our behalf) acquire from you when you use our online or mobile offerings (the<br />&quot;Services&quot;), how that information is collected, and how it is used.<br />&nbsp;<br />4. This Privacy Policy is part of the Terms &amp; Conditions and should be read in conjunction with<br />them. You agree that we (or others acting on our behalf) may collect, record, store, adapt, alter,<br />analyze, retrieve, use, transfer, process, transmit, disseminate, make available, restrict, erase,<br />destruct, combine, and/or disclose (&quot;process&quot;) your personal information in accordance with the<br />terms of this Privacy Policy when you access or use our offerings and/or services.&nbsp;<br />&nbsp;<br /><br /><strong> II.  Collection of Personal Information  </strong> <br />5. We (or those acting on our behalf) collect your email address as well as a unique activity log<br />for you that contains administrative and traffic information, such as time of access, date of<br />access, and usage history. Furthermore, if you give us any personal information, we may collect<br />that information as well.<br /><br />6. We (or those acting on our behalf) collect the aforesaid personal information when you use the<br />services or when you provide it to us, and also in your communications with us.<br /><br />7. You are responsible for ensuring the accuracy of your personal information and all other<br />information you submit to us (or others on our behalf). Inaccurate personal information will<br />affect the information you receive when using the services and our ability to contact you as<br />contemplated in this Privacy Policy. You may update your personal information by logging into<br />your account and updating your personal information or by e-mailing customer support at<br />support@coinparliament.com. For service quality assurance, any contact made by you to the<br />customer service department may be recorded, documented, and used by us at our sole<br />discretion.<br />&nbsp;<br />&nbsp;<br />&nbsp;</p>
<p><br /><strong>III. Processing Personal Information </strong> <br />&nbsp;<br />8. We use the personal information and other information we (or others on our behalf) collect<br />from or about you for a variety of reasons, including but not limited to, delivering the services,<br />providing customer support, conducting necessary security and identity verification checks,<br />processing any of your online or mobile transactions, meeting certain business and/or regulatory<br />requirements, and any other reason related to the operation of the services. We may disclose your<br />personal information (and any other information) to any third parties that provide services to us<br />in order to allow, enable, or improve the provision of the services to you. Without derogating<br />from the above, your personal information will be disclosed to our employees and staff members<br />for the purpose of providing support services, credit management services, and fraud prevention<br />services; to our accountants and auditors for accounting and auditing purposes; and to our<br />ambassador for the purpose of providing the services. Your personal information may also be used<br />by us, our licensees, and/or affiliates (including any service providers acting on their behalf)<br />(collectively, the&quot;Marketers&quot;) to send you promotional offers and information about the<br />Services, as well as products and services from the Marketers and other third parties, and to help<br />us improve our offering of a variety of products and services and customer service. The<br />promotional offers may be provided to you via various means, including but not limited to (i)<br />email and/or (ii) via the services (including, but not limited to, push notifications, pop-ups, or<br />pop-unders). We may also use the aforesaid personally identifiable information to track your use<br />of the services and for other internal purposes, such as evaluating, providing, and improving the<br />services.<br />&nbsp;<br />9. We may disclose your personal information and other information we (or others on our behalf)<br />collect from or about you if required to do so by law, or if we believe in good faith that such<br />action is necessary to comply with a current judicial proceeding, a court order or legal process, or<br />to protect and defend our rights or property, the personal safety of users of the services, or the<br />public.<br />We reserve the right to share the aforesaid information with any third party if we determine in<br />our sole discretion that you have cheated or attempted to defraud us, or if we suspect you of<br />committing any fraudulent activity (including fraudulent payment), or any other prohibited<br />transaction.<br />&nbsp;<br />10. We may transfer any personal information outside your country of residence and outside the<br />European Union and store it in other countries. The data protection and other laws of these<br />countries may not be as comprehensive as those in the European Union. In these instances, we<br />will take steps to ensure that a sufficient level of protection is given to your personal information.<br /><br />&nbsp;<br /><strong>IV. Retention of Personal Information</strong> <br />&nbsp;<br />11. We will retain all of your personal information for the time set by applicable legislation in<br />order to maintain our rights.<br />&nbsp;</p>
<p><strong> V. Choice/Opt-Out</strong> <br />&nbsp;<br />12. You may opt-out of receiving promotional communications from us by sending a blank e-<br />mail with the word &ldquo;Remove&rdquo;. If you have any questions relating to opting-out, please contact<br />our customer support. Please note that even if you opt-out, we may continue to send you service-<br />related updates and notifications.<br />&nbsp;<br /><strong>VI. Cookies </strong><br />&nbsp;<br />13. We (or others on our behalf) use a browser feature known as cookies, which are small text<br />files that are placed on your computer or equipment when you visit certain online or mobile<br />pages, to track your activities, record your preferences, and make the services more responsive to<br />your needs by delivering a better and more personalized experience to you. The cookies are<br />stored on your computer and/or equipment and are used by us to help track your activity and pass<br />information as you use the services. Cookies can allow us to associate navigational information<br />from browsing visits with the personal information you provide to us.&nbsp;<br />&nbsp;<br /><strong> VII. Security</strong> <br />&nbsp;<br />14. We have implemented suitable security policies, rules, and technical measures to protect and<br />safeguard the personal information under its control from unauthorized access, improper use or<br />disclosure, unauthorized modification, unlawful destruction, or accidental loss. All of our<br />employees and data processors that have access to, and are associated with the processing of<br />your personal information, are obliged to respect the confidentiality of your personal<br />information. <br />&nbsp;<br /><strong> VIII.  Links to Other Sites </strong> <br />&nbsp;<br />15. Our websites, mobile sites, and mobile applications may contain links to other websites,<br />mobile sites, and mobile applications. Other websites, mobile sites, and mobile applications may<br />also reference or link to our website, mobile site, and/or mobile application. We are not<br />responsible for the privacy practices or the content of such other websites, mobile sites, and<br />mobile applications, and any information collected by these third-party websites, mobile sites,<br />and mobile applications is not governed by this Privacy Policy, and we assume no responsibility<br />or liability whatsoever for the policies (including privacy policies), practices, actions or<br />omissions of such third parties.<br />&nbsp;<br />&nbsp;<br />&nbsp;<br />&nbsp;<br /><strong> IX. Transfer</strong> <br />&nbsp;</p>
<p>16. In the event that we sell, assign, or transfer some or all of our business or assets to a<br />successor or acquirer, directly or indirectly, including, but not limited to, in connection with the<br />sale, merger, acquisition, and/or bankruptcy and/or insolvency proceedings, we may sell, assign,<br />or transfer all of your personal information and other information provided by you or about you,<br />regardless of your opt status, to such successor or acquirer.<br />&nbsp;<br /><strong> X. Disclaimer </strong><br />&nbsp;<br />17. The transmission of information via the internet is not completely secure. Although we do<br />our best to protect your personal information, we cannot guarantee the security of the data<br />transmitted to our website, mobile site, and/or mobile application; transmission is at your own<br />risk. Accordingly, we (including our directors, officers, shareholders, suppliers, advisors,<br />contractors, and affiliates) will not be liable for any direct, indirect, incidental, consequential,<br />and/or punitive damages relating to the use or release of personal information resulting from<br />events outside of our control.&nbsp;<br />&nbsp;<br />XI.<strong> Your Acceptance of This Policy</strong> <br />&nbsp;<br />18. By agreeing to the Terms &amp; Conditions during the registration process on our website,<br />mobile site, and/or mobile application, or by continued use of the services, you agree to be bound<br />by this privacy policy and to any changes, we may make to this privacy policy from time to time.<br />We will notify you of any such changes to the Privacy Policy by posting an updated version of<br />the privacy policy on our website, mobile site, and/or mobile application. Your continued use of<br />the services will amount to and be construed as your consent to such changes.</p>`;
const GameRule = ``;
const Foundations = ``;
const Ambassador = ``;
export const TermsAndCondition = `<p> <strong> I.  General </strong> <br /><br />1. We use cookies to personalise content and ads, to provide social media features <br />and to analyse our traffic We also share information about your use of our site with <br />  our social media, advertising and analytics partners who may combine it with other <br /> information that  you’ve provided to them or that they’ve collected from your use of <br /> their services.
<br /> <br />2. We provide online and mobile financial games to you subject to the following terms<br />and conditions contained within these terms and conditions (the&quot;Terms and<br />Conditions&quot;), which should be read carefully by you in its entirety prior to your use of the<br />Services. Please note that these terms and conditions constitute a legally binding<br />agreement between you and us.<br /><br />3. In addition to these terms and conditions, please check our Privacy Policy, as well as<br />the game's rules, regulations, terms, and conditions, and the risk disclaimer - all of<br />which are included herein by reference, as well as any other policies that we may notify<br />you of from time to time.</p>
<p>&nbsp;<br />&nbsp;<strong> II.  Definitions </strong> <br /><br />4. In these terms and conditions, the following words and phrases shall (unless the<br />context otherwise requires) have the meanings set out beside them:&quot;Account&quot; shall<br />mean a personal account opened by an individual solely for that individual to enable<br />that individual to wager at the Site.&quot;Game&quot; shall mean the game of voting on different<br />events, in accordance with the Rules.&quot;Illegal Actions&quot; shall mean illegal, unlawful,<br />abusive, manipulative, fraudulent, money laundering, or other improper activities,<br />including, but not limited to, (i) the use of devices and software such as robots or other<br />high-speed systems; (ii) sale, transfer, and/or acquiring accounts from other players; (iii)<br />transfer of funds amongst players' accounts; (iv) acting in concert with others, (v)<br />holding long and short positions at the same time; (vi) influencing the exchange rate of<br />the assets and/or the outcome of any wager; (vii) using any artificial intelligence<br />software, or (vii) or breaking into the Site, as well as any attempt to do the same.<br />&quot;Player&quot; shall mean anyone who registers via the site and opens an account.<br />&quot;Restricted Territories&quot; shall mean any jurisdictions determined by Us at Our sole<br />discretion for the purpose of blocking persons from those jurisdiction Site ns from<br />playing the Game.&quot;Rules&quot; shall mean the rules of the game posted on the site.<br />&quot;Services&quot; shall mean the Games and any other services and activities offered on the<br />Site.&quot;Site&quot; shall mean any website and/or mobile site and/or mobile application owned,<br />operated, or hosted by us.&quot;We&quot;,&quot;Our&quot; or&quot;Us&quot; shall mean the operator of the Site<br />and/or any subsidiaries, affiliates, employees, directors, officers, agents, suppliers,<br />consultants, and contractors.&quot;You&quot; or&quot;you're&quot; shall mean any user of the site.<br /><br />&nbsp;<strong> III.  Subordination to the Terms and Conditions and the Binding Effect Thereof. </strong> <br />&nbsp;<br />&nbsp;5. Anyone registered at the Site, in accordance with the procedure specified hereafter,<br />or participating in one of the Site's proposed activities, or using the information<br />published on the Site, accepts upon himself/herself, in free will and consent, the Terms<br />and Conditions' authority, agrees to be bound by the Terms and Conditions, undertakes<br />to act pursuant to the Terms and Conditions' stipulations and to the Rules, as they will<br />be updated from time to time, without any reservation.<br /><br />6. We are entitled to amend these terms and conditions at any time and do so according<br />to our absolute and exclusive discretion. Your only remedy in the case in which you do<br />not wish to be bound by such an amendment is to stop using our site and services and<br />to close your account.<br /><br />7. These Terms and Conditions and the other terms and conditions referred to herein or<br />incorporated by reference hereto, as may be updated or amended from time to time by<br />Us, constitute the entire and whole agreement between You and Us. You confirm that, in<br />agreeing to accept these terms and conditions, you have not relied on any<br />representation except for any express representation made by us in these terms and<br />conditions.<br /></p>
<p>&nbsp;<strong> IV. Who is Entitled to Participate? </strong> <br /><br />8. Using the services is permitted solely if you comply with all of the following:<br />A. &nbsp; On the participation date, you are eighteen (18) years old or of legal age, as<br />determined by the laws of the country where you live (whichever is higher);<br />and&nbsp;<br />B. You do not violate any law or regulation due to using the services. In this context, it<br />will be stressed that if you reside or are present in any jurisdiction that prohibits using<br />the services offered at the Site (including without limitation any of the Restricted<br />Territories), you shall not participate in the prohibited activity.<br /><br />9. The services are intended only for users who are not prohibited by the laws of any<br />applicable jurisdiction from playing the game on the internet and/or mobile devices. We<br />do not intend to enable You to contravene applicable law. You represent, warrant, and<br />agree to ensure that your use of the site and/or the services will comply with all<br />applicable laws, statutes, and regulations. The offering or availability of the Services<br />shall not be deemed or interpreted as an offer or invitation by Us to use the Services if<br />You reside in a place in which such use is forbidden by law (including without limitation<br />the Restricted Territories), or where We, in Our sole discretion, elect not to offer<br />Services. You shall be solely responsible for determining whether Your use of the Site<br />and/or Services is legal in the place where You live and/or use the Site and/or Services.<br />We make no representations or warranties, expressed or implied, concerning the<br />legality of the Services and/or of the Site and/or of any person's participation in the<br />Services through this Site, and shall not be responsible for any illegal use of the Site by<br />you. It is your responsibility to ensure that you comply with any and all laws applicable<br />to you before registering or participating in any of the services through this site. You<br />should consult with legal counsel in the applicable jurisdiction about the legality of your<br />use of the site and/or the services.<br />&nbsp;<br />10. We reserve the right at any time to request from You evidence of Your residence,<br />location, and/or age and reserve the right to suspend or cancel Your Account and<br />exclude You, temporarily or permanently, from using the Services if satisfactory proof is<br />not provided or if We suspect that You are underage and/or reside and/or located in any<br />Restricted Territory and such satisfactory proof is not provided by You within three (3)<br />days of Us requesting such proof. In any such case, we reserve the right to close your<br />account, and the balance in your account will be dealt with in accordance with our<br />decision.<br />&nbsp;<br />11. Our employees, directors, and officers, as well as members of their families,<br />affiliates, or subsidiaries, and all other persons connected, directly or indirectly, to the<br />computer systems or the security systems employed by us, as well as any person<br />involved in the operation of this site and the establishment thereof, including, but not<br />limited to advertising, promotion, and fulfillment agencies, insurers and legal advisers,<br />webmasters and web suppliers, and family members thereof, are not entitled to<br />participate in any of the services. For the sake of good order, it is clarified that any<br />person who is not entitled to participate as aforesaid - as well as any other person who</p>
<p>substitutes for such excluded person - is also not entitled to any winnings from wagering<br />via the Site, and we reserve the right to shut down his/her account and seize any funds<br />held in such account.<br /><br />12. Harassment, vulgar, or abusive language, in any form, is absolutely forbidden on<br />any of our channels. A player who uses profane language will be warned and then<br />permanently removed from the game.<br />&nbsp;<br />&nbsp;<strong> V. Account Registration </strong><br /><br />13. Anyone interested in participating in the services is obliged to register and open an<br />account on the site.<br />&nbsp;<br />14. For the purpose of registration, you must provide an email address (which will be<br />your username) and a password (the&quot;Identification Details&quot;).<br />&nbsp;<br />15. You shall be fully and solely responsible to reserve in confidentiality Your<br />Identification Details and not transfer them to another. The full responsibility for<br />unauthorized use of your identification details lies solely with you, and you will bear all<br />responsibility derived from the unauthorized use of your identification details. We have<br />no obligation to maintain your identification details. If you misplace, forget or lose your<br />identification details because of anything other than our error, we shall not be liable for<br />any direct or indirect loss associated with such an occurrence.<br /><br />16. We may require additional personal identification details upon any special<br />circumstances including, but not limited to, suspected fraud or any other abusive<br />activities, abnormal activity, and Your jurisdiction.<br />&nbsp;<br />17. You hereby represent that the registration of your account is done personally by you<br />and not by any third party.<br />&nbsp;<br />18. By opening an account, you hereby represent, warrant, acknowledge and undertake<br />that (A) Your account is for your personal use only and not on behalf of any third party,<br />and that you May only open a single account at the site, (B) Any funds you Will deposit<br />in the account May and Will be used by you solely for playing the game, (C) We are not<br />a financial institution and any funds in your account shall not accrue any linkage<br />differentials and/Or interest, (D) You are of sound mind and you are capable of taking<br />responsibility for your own actions, (E) You have read, comprehended and fully<br />understand the rules, (F) You have read, comprehended and understood the disclaimer<br />posted on the site, (G) You Will cooperate with us and provide us with all requested<br />documentation in a full, complete and truthful manner, (H) You have verified and<br />determined that your use of the services does not violate any laws or regulations of any<br />jurisdiction that applies to you, (I) You are solely responsible for recording, paying and<br />accounting to any relevant governmental, taxation or other authority for any tax or other<br />levy that May be payable due to your use of the site (J) You will use the services in good<br />faith towards us and others using the services (K) You shall be solely responsible for</p>
<p>maintaining the confidentiality of your user Name and password required for entering<br />your account, and for any and all actions and transactions taken in connection with your<br />account by anyone who enters your account while using your user Name and password,<br />and all such actions and transactions shall be deemed as actions and transactions<br />taken by you, and (N) You will immediately inform us of any suspected unauthorized use<br />of your account.<br /><br />19. You further represent, warrant, acknowledge and undertake that (A) You will not use<br />your account, and Will not allow any third party to use your account, for any illegal<br />actions, and (B) In case you will perform any illegal activities we shall be entitled to<br />disclose any and all of your account and information to the relevant authorities, and to<br />suspend and/Or cancel your account and confiscate any and all funds in your account,<br />(C) &nbsp;You shall be solely responsible for all losses, liabilities, and damages incurred as a<br />result of any illegal activities performed by you and you shall indemnify us for any such<br />losses, damages, and liabilities, (D) You have not had an account in the past which was<br />terminated or suspended by us, (E) The funds deposited in your account are yours and<br />were not stolen or reported as lost.<br />&nbsp;<br /><strong> VI. Account Operations</strong><br /><br />20. It is unlawful to deposit any funds in your account from ill-gotten means, and you will<br />not make such deposits. Without derogating from the above, you hereby acknowledge<br />that we are authorized to check transactions to prevent money laundering and will<br />report any suspicious transactions to the relevant authorities.<br /><br />21. In the event of a conflict between (i) the results published on the site and/or received<br />by you and/or provided by any third party, and (ii) the results registered with our systems<br />(or with systems operated on our behalf by third parties), the latter shall prevail. You<br />understand and agree that our records (or records maintained on our behalf) shall be<br />the final authority in determining the terms of Your use of the Services.<br /><br />&nbsp;<strong> VII. Our Powers and Authorities </strong><br /><br />&nbsp;22. We will make commercially reasonable efforts to prevent any malfunctions in the<br />App/site's activity. However, in the event of a technical failure (or any other error) in the<br />App/site's systems for any reason whatsoever, we will be entitled to cancel your<br />participation in the game in which the malfunctioning has occurred. In such an event,<br />our responsibility and your liability will be limited only to the wager placed by you, and<br />your account will be credited accordingly.<br />23. We keep the right to modify and/or cancel the game features and/or rewards,<br />bonuses, terms of use, daily interest, and/or any other features in the game at any time,<br />retroactively as well!<br />&nbsp;24. We reserve the right to cancel, terminate, modify, or suspend the services or parts<br />of them and/or the game if, for any reason, the services and/or the game cannot be<br />conducted as planned, including, but not limited to, infection by computer virus, bugs,</p>
<p>tampering, or unauthorized intervention, fraud, technical failures, or any other causes<br />beyond our control.<br />&nbsp;25. If you are disconnected from the internet while playing a game (not through any<br />intentional disconnection on your part or any other bad-faith action), the game's results<br />and your account's balance will be kept as they were before the disconnection.<br />&nbsp;<br /><strong> VIII. Digital Items</strong><br /><br />26. Unless the context otherwise requires, the following will mean:<br />&nbsp;<br />A. SVI (social voting indicatore)- The use of Coin Parliament's social voting indicator<br />(SVI) is at your own risk. We do not guarantee the accuracy or completeness of the<br />information provided and cannot be held responsible for any outcomes resulting from<br />its use. We recommend conducting your own research and analysis before making any<br />investment decisions. Additionally, we advise against investing more than you can<br />afford to lose. By using our platform, you acknowledge that you are solely responsible<br />for your investment decisions.<br />B. Coins:&nbsp;<br />Coins are in-game currency; These coins are game coins only and have no conversion<br />value for any other currency. Coins can be obtained by playing and purchasing in the<br />game. Coins are not transferable to another player. Coins are not withdrawable.<br />&nbsp;<br />C.Collectible cards<br />As part of the game, you can earn and swap unique Collectible cards; Collectible cards are unique digital<br />trading non-fungible tokens (&quot;COLLECTIBLE CARD&quot;). Any in-game Collectible cards earned or swapped can be<br />transferred to a personal digital wallet. When the player who previously swapped or<br />earned the item is higher in the sending queue, the transfer will be made according to<br />the sending queue. The player is in charge of sending Collectible card; he must provide us with a<br />specific wallet address to which we will send the item in question. An Collectible card sent to the<br />wrong address cannot be resent. Sending earned Collectible card from the App is limited to 10<br />days from the day of winning/swapping. If the Collectible cards is not claimed within 10 days, it will<br />not be sent to an external wallet, but will only remain in the app. Please make certain<br />that the Collectible card is delivered on time. Coin Parliament is not liable for the outcomes or<br />trading procedures of our clients' Collectible cards.<br /><br /><strong> VIII. Termination Of Account Or Services </strong><br /><br />27. We reserve the right to limit, suspend, terminate, modify or delete your Account or<br />your access to our Services or portions of our Services (including User Content) if you,<br />or we suspect that you are, failing to comply with any of these Terms, our Privacy Policy<br />or our House Rules or for any actual or suspected illegal or improper use of our<br />Services, with or without notice to you.<br />If we terminate your account, other than for inactivity, you must not access any other<br />accounts or create any further accounts.</p>
<p>We reserve the right to delete your account if no activity is conducted by you in relation<br />to the account for 180 or more days. If your account is deleted, for this reason, you will<br />no longer be able to access and/or use any virtual items associated with that account<br />and no refund will be offered to you.<br />You understand that if you delete your account, or if we delete your account in<br />accordance with these terms, you may lose access to any data previously associated<br />with your account (including, without limitation, the level or score you have reached in<br />our services and any virtual items associated with your account). You agree to<br />compensate us, according to law, for all losses, harm, claims, and expenses that may<br />arise from any breach of these terms by you.<br />&nbsp;<br /><strong> Deletion Request Rights </strong><br />28. You have the right to request that we delete your personal information that we<br />collected from you and retained it, subject to certain exceptions. Once we receive and<br />confirm your request, we will delete your personal information from our records, unless<br />an exception applies.<br />&nbsp;<br />We may deny your deletion request if retaining the information is necessary for us or<br />our service provider(s) to:<br />&middot; Detect security incidents, protect against malicious, deceptive, fraudulent,<br />or illegal activity, or prosecute those responsible for such activities.<br />&middot; Debug products to identify and repair errors that impair existing intended<br />functionality.<br />&middot; Comply with a legal obligation.<br />&middot; To exercise the access, data portability, and deletion rights described<br />above, please submit a verifiable consumer request to us by emailing us at<br />support@coinparliament.com<br />&middot; Only you, or someone legally authorized to act on your behalf, may make<br />a verifiable consumer request related to your personal information.<br />&middot; You may make a consumer request for deletion of your details, only if you<br />provide us with the following:<br />&middot; Describe your request with sufficient detail that allows us to properly<br />understand, evaluate, and respond to it.<br />&middot; We cannot respond to your request or provide you with personal<br />information if we cannot verify your identity or authority to make the request and<br />confirm the personal information relates to you.<br />&nbsp;<br /><strong> IX. Reservations concerning Our Responsibility; Indemnification </strong><br />&nbsp;<br />29. We are not responsible for any error, omission, interruption, deletion, defect, delay<br />in operation or transmission, communications line failure, theft or destruction or<br />unauthorized access to, or alteration of data or information and any direct or indirect<br />loss which arises from these occurrences. We are not responsible for any problems or<br />technical malfunction of any network or lines, Wi-Fi, Bluetooth, computers, systems,<br />servers, providers, computer equipment, and/or software. We shall not be responsible<br />or liable to You in the event of systems or communications errors, bugs, or viruses</p>
<p>relating to the Services and/or Your Account or which will result in damage to Your<br />hardware and/or software and/or data.<br />&nbsp;<br />30. We make no representations about the suitability, reliability, availability, timeliness,<br />and accuracy of the information, software, products, and services contained and/or<br />offered on the site for any purpose. All information, software, products, and services are<br />provided&quot;as is&quot; without warranty of any kind. We hereby disclaim all warranties with<br />respect to information, software, products, and services contained or offered on the site,<br />whether expressed or implied. We shall have no liability with respect to any damage or<br />loss that was caused due to reliance, of any type, on the information or any other<br />publication or content appearing at the Site, and You are invited to verify the information<br />published at the Site.<br /><br />31. We shall not be responsible or liable for any actions or omissions of the internet<br />service provider or any other third party which provides You with access to the Site<br />and/or Services.<br />&nbsp;<br />32. You shall indemnify Us and hold Us harmless, from and against all direct and<br />indirect claims, liabilities, damages, losses, costs, and expenses, including legal fees,<br />arising out of or in connection with any breach of these Terms and Conditions by You,<br />and any other liabilities arising out of your use of the site or any unauthorized use of the<br />site by any third party using your user name and password.<br /><br />33. The site, services, and site&rsquo;s content, and the software used in connection therewith<br />are provided &ldquo;as is&rdquo;, and we make no warranty or representation, whether expressed or<br />implied (whether by law, statute, or otherwise), including but not limited to implied<br />warranties and conditions of merchantability, satisfactory quality, fitness for a particular<br />purpose, completeness or accuracy, non-infringement of third party rights or of<br />applicable laws and regulations in respect of the site, services, and site&rsquo;s content, and<br />the software used in connection therewith, or that the site, services, site&rsquo;s content, site's<br />content, and the software used in connection therewith will be uninterrupted, timely,<br />secure, or error-free, or that defects will be corrected, or will be free of viruses or bugs,<br />or as to results or the accuracy of any information through the site or services.<br />&nbsp;<br /><strong> X. Intellectual Property (IP)</strong><br /><br />34. All the rights, including the intellectual property rights (i.e., patents, copyright,<br />trademarks, service marks, logos, trade names, know-how, or any other intellectual<br />property right) concerning the site and all of its content (including, but not limited to,<br />programs, files, video, audio, pictures, graphics, pictures, text, and software), and/or<br />services (collectively the &ldquo;Rights&quot;), are and shall remain our and/or our licensors' sole<br />and exclusive property. You may not use any of the Rights without Our prior written<br />approval, except pursuant to these Terms and Conditions, and You shall not, by using<br />the Services or otherwise, acquire any rights in any of the rights. Without derogating<br />from the above, you are strictly prohibited from (i) copying, redistributing, publishing,<br />reverse engineering, decompiling, disassembling, modifying, translating, or making any</p>
<p>attempt to access the source code of the services and/or the site to create derivative<br />works of the source code; (ii) selling, assigning, licensing, sublicensing, transferring, or<br />distributing the services; and (iii) making the services and/or the site available to any<br />third party.<br />&nbsp;<strong>XI. Customer Support</strong><br /><br />35. You may contact us in connection with anything related to the site and/or the<br />services via our customer support, which is available at support@coinparliament.com<br />&nbsp;<br /><br /><strong> XII. Miscellaneous</strong><br />&nbsp;<br />36. These Terms and Conditions and the relationship between you and us shall be<br />governed by and construed and interpreted in accordance with, the laws of the State of<br />Portugal, and you irrevocably submit to the exclusive jurisdiction of the competent<br />courts of the Lisbon District, Portugal, with respect to any dispute regarding the validity,<br />breach, interpretation, performance or otherwise arising out of or in connection with<br />these Terms and Conditions and the relationship between you and us.<br />&nbsp;<br />37. We may transfer or assign any and all of our rights and obligations hereunder to any<br />third party. Without derogating from the above, the site and/or any of the services may<br />be operated by third parties. You may not transfer, assign or pledge in any manner<br />whatsoever any of Your rights or obligations under these Terms and Conditions.<br />&nbsp;<br />38. Unless explicitly stated in these Terms and Conditions, nothing in these Terms and<br />Conditions shall: (i) be construed as creating any agency, arrangement, trust of fiduciary<br />relationships or any similar relationship between You and Us; (ii) create or confer any<br />rights or benefits to any third party, and/or (iii) grant You any security interest in any<br />asset of Ours, including (but not limited to) any sum held in Your account.<br />&nbsp;<br />39. We may provide You with notices with respect to or in connection with these Terms<br />and Conditions via e-mail and/or through the Site, and such notice shall be deemed<br />received by You within one hour from the time it is sent or posted in an aforesaid<br />manner.<br /><br />40. These terms and conditions have been drafted in the English language. In the event<br />of any discrepancy between the meanings of any translated versions of these Terms<br />and Conditions and the English language version, the meaning of the English language<br />version shall prevail.<br /><br />41. No failure or delay on our part in exercising any right, power, or remedy thereunder<br />shall operate as a waiver thereof, nor shall any single or partial exercise of any such<br />right, power, or remedy preclude any other or further exercise thereof or the exercise of<br />any other right, power or remedy.<br /></p>
<p>42. If any provision of these Terms and Conditions is held by a court of competent<br />jurisdiction to be unenforceable under applicable law, then such provision shall be<br />excluded from these Terms and Conditions and the remainder of these Terms and<br />Conditions shall be interpreted as if such provision was so excluded and shall be<br />enforceable in accordance with its terms; provided, however, that in such event these<br />Terms and Conditions shall be interpreted so as to give effect, to the greatest extent<br />consistent with and permitted by applicable law, to the meaning and intention of the<br />excluded provision as determined by such court of competent jurisdiction. Valid until<br />further notice.</p>​`;


export const myPages: ContentPage[] = [
  {
    title: "About",
    content: about,
    slug: "about",
  },
  {
    title: "Game Rules",
    content: GameRule,
    slug: "gamerule",
  },
  {
    title: "Ambassador",
    content: Ambassador,
    slug: "Ambassador",
  },
  {
    title: "Foundations",
    content: Foundations,
    slug: "foundations",
  },
  {
    title: "Knowledge Hub",
    content: privacy,
    slug: "knowledgehub",
  },
];

export type Quote = { text: string; source: string }
export const quotes: Quote[] = [
  {
    text: "Free Speech is the Bedrock of a Functioning Democracy",
    source: "Elon Musk",
  },
  {
    text: "You’ve got to vote, vote, vote, vote. That’s it; that’s the way we move forward",
    source: "Michelle Obama",
  },
  {
    text: "It's not enough to just want change ... You have to go and make change by voting",
    source: "Taylor Swift",
  },
  {
    text: "All of us may have been created equal. But we'll never actually be equal until we all vote. So don't wait",
    source: "Leonardo DiCaprio",
  },
  {
    text: "A man without a vote is a man without protection",
    source: "Lyndon B. Johnson",
  },
  {
    text: "Voting is not only our right—it is our power",
    source: "Loung Ung",
  },
  {
    text: "If you don’t vote, you lose the right to complain",
    source: "George Carlin",
  },
  {
    text: "Someone struggled for your right to vote. Use it",
    source: "Susan B. Anthony",
  },
  {
    text: "There’s no such thing as a vote that doesn’t matter. It all matters",
    source: "Barack Obama",
  },
  {
    text: "We have the power to make a difference. But we need to VOTE",
    source: "Kylie Jenner",
  },
  {
    text: "Talk is cheap, voting is free; take it to the polls",
    source: "Nanette L. Avery",
  },
];

export const social = {};
export const generateGoogle2faUrl = `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/api/v1/admin/auth/generateGoogleAuthOTP`;
export const otpurl = `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/api/v1/admin/auth/verifyGoogleAuthOTP`;


// FAQ
export const FrequentlyAskQus = [
  {
    question: 'What is Coin Parliament: Vote To Earn?',
    answer: 'Coin Parliament: Vote To Earn is a web 3-based game that combines crypto voting, card collecting, and blockchain technology. Players vote for their favorite crypto coins and pairs, collect unique cards, and can upgrade to convert their card collection into Collectibles on the blockchain.',
  },
  {
    question: 'How do I start playing Coin Parliament?',
    answer: 'To begin, simply sign up as a Member on our platform. Once registered, you can start participating in crypto voting and collecting cards.',
  },
  {
    question: 'What are Collectibles, and how do I get them?',
    answer: 'Collectibles are valuable blockchain assets created from your card collection when you upgrade your account to Mining. Being the first owner of a Collectible card entitles you to 50% royalties from the sale.',
  },
  {
    question: 'How do I earn Coin Mining Progress (CMP)?',
    answer: 'You can earn CMP by actively participating in crypto voting. Your CMP increases based on the frequency of your votes and their impact levels (Low, Mid, High).',
  },
  {
    question: 'What are Influencer Levels, and how do they work?',
    answer: 'Influencer levels (Chairman, Minister, Ambassador, Counsel, Speaker) are earned based on your voting activity, impact, and seniority. Higher influencer levels grant better CMP rewards for each vote.',
  },
  {
    question: 'What can I do with Parliament coins (VTE)?',
    answer: 'Parliament coins (VTE) can be used for discounts when purchasing Vote To Earn merchandise on our platform.',
  },
  {
    question: 'How does the Ambassadors Program work?',
    answer: "The Ambassadors Program allows you to refer friends to the platform. You earn 50% lifetime commissions from the purchase amounts made by the members you've referred. Simply share your referral link, and commissions are sent directly to your wallet.",
  },
  {
    question: "Can I trade or sell my Collectibles?",
    answer: "Yes, once your cards are converted into Collectibles, you can store, trade, or sell them on compatible blockchain marketplaces.",
  },
  {
    question: "Is my card collection secure on the blockchain?",
    answer: "Yes, all Collectibles are permanently recorded on the public blockchain, ensuring the security and ownership of your digital assets.",
  },
  {
    question: "How can I upgrade to a Mining account?",
    answer: "To upgrade to a Mining account and convert your cards into Collectibles, follow the in-game instructions and meet the necessary requirements.",
  },
  {
    question: "What is the benefit of being the first owner of a Collectible card?",
    answer: "Being the first owner of a Collectible card entitles you to 50% royalties from the sale, providing you with continuous income.",
  },
  {
    question: "What is the fee structure for buying and selling Collectibles?",
    answer: "A fee is charged when buying or selling Collectibles, with 50% of this fee going to the first owner of the Collectible.",
  },
  {
    question: "Are there any limitations on the number of cards I can collect?",
    answer: "There are no limitations on the number of cards you can collect. Your collection can continue to grow.",
  },
  {
    question: "Do I need to withdraw Parliament coins (VTE) to an external wallet?",
    answer: "No, you don't need to withdraw VTE because you already have it in your game wallet.",
  },
  {
    question: "How often is the list of influencers updated, and how can I maintain my level?",
    answer: "The list of influencers is updated daily. To maintain your level or move up, participate actively in voting and maintain a high level of engagement.",
  },
  {
    question: "What happens if I lose access to my account or wallet?",
    answer: "We recommend securely storing your account information and wallet details. Losing access may result in the loss of your Collectibles and rewards.",
  },
  {
    question: "How do I know if a card I own is eligible for conversion into a Collectible?",
    answer: "Eligibility for conversion is based on account upgrades and meeting specific requirements. Check the in-game instructions for details.",
  },
  {
    question: "Can I change my influencer level once it's achieved?",
    answer: "our influencer level can change based on your voting activity and seniority within the platform.",
  },
  {
    question: "What happens if I refer a friend who becomes an influencer?",
    answer: "If your referred friend becomes an influencer, you may receive increased referral commissions based on their activity.",
  },
  {
    question: "Is Coin Parliament available in multiple languages?",
    answer: "Currently, Coin Parliament is available in English. We are actively exploring options for additional language support in the future.",
  },
  {
    question: "What are collectibles?",
    answer: "Collectibles are unique, blockchain-based digital treasures created from your card collection. They come in different rarities (common, uncommon, rare, epic, legendary) and offer:<br/><br/>Ownership and Rarity: Proof of ownership recorded on the blockchain.<br/>Market Value: Potential for significant value and trading on blockchain marketplaces.<br/>Royalties: As the original owner, you earn 50% of future sales fees.<br/>Collectibles add depth and investment potential to your digital collection, blurring the line between digital and physical collecting.",
  },
  {
    question: "What is SVI for Coin?",
    answer: 'SVI for Coin is a proprietary indicator that compiles voting data based on factors like volume, time frame, and voter success rates. It provides a visual representation of community sentiment for a specific cryptocurrency. A reading above 50 suggests that more people have voted "BULL," indicating optimism about the coin\'s potential for growth. Conversely, a reading below 50 signifies more "BEAR" votes, indicating a belief that the coin may decrease in value.',
  },
  {
    question: "How does SVI for Pairs work?",
    answer: "SVI for Pairs is also a proprietary indicator, but it assesses the voting profiles for cryptocurrency pairs. It uses a similar algorithm as SVI for Coin to determine sentiment. A reading above 50 suggests that more voters believe one coin in the pair will outperform the other. This can help traders make more informed decisions when trading cryptocurrency pairs.",
  },
  {
    question: "Is it 100% safe to use SVI for trading decisions?",
    answer: "No, it's not recommended to solely rely on SVI or any single indicator for trading decisions. Cryptocurrency markets are inherently volatile, and trading involves risks. While SVI provides valuable insights into community sentiment, it should be used as one tool among many. Always conduct your research, develop a sound trading strategy, and manage risks wisely. Never invest more than you can afford to lose in the cryptocurrency market.",
  },
]

export const gameRules = [
  {
    step: "Start as a Member",
    desc: "Begin as a Member in Coin Parliament."
  },
  {
    step: "Voting for Crypto Coins and Pairs:",
    desc: "Participate in voting for your favorite crypto coins and pairs.<br />Each vote has three impact levels: Low, Mid, and High."
  },
  {
    step: "Earn Coin Mining Progress (CMP):",
    desc: "Accumulate Coin Mining Progress (CMP) by voting regularly.<br />CMP is a measure of your progress in the game."
  },
  {
    step: "Reach 100 CMP:",
    desc: "Work towards reaching 100 CMP."
  },
  {
    step: "Unlock Rewards:",
    desc: "When you reach 100 CMP, you unlock rewards, including:<br />Parliament coins (VTE)<br />Extra votes<br/>Unique cards for your collection"
  },
  {
    step: "Progress Through Influencer Levels:",
    desc: "There are five influencer levels: Chairman, Minister, Ambassador, Counsel, and Speaker.<br/>Your influencer level determines your CMP rewards for each vote.<br/>Levels can change based on your voting activity and seniority."
  },
  {
    step: "Collect Unique Cards",
    desc: "Aim to collect unique cards as you continue to vote and progress in the game.<br/>Collecting cards is a central aspect of the game."
  },
  {
    step: "Upgrade to Mining Account:",
    desc: "To take your card collection to the next level, upgrade your account to a Mining account."
  },
  {
    step: "Automatic Card-to-Collectible Conversion:",
    desc: "As you upgrade to a Mining account, your cards are automatically converted into Collectibles.<br/>A Collectible is a unique item permanently recorded on the public blockchain, owned by the holder of the corresponding address."
  },
  {
    step: "Benefits of Collectibles:",
    desc: "- Collectibles are forever owned by the member.<br/>- Members are free to display them, sell them, or take advantage of the features they unlock.<br/>- Being the first owner of a Collectible card earns you lifetime royalties of 50% from its sales, providing a continuous income stream."
  },
]