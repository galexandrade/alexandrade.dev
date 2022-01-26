import { Link } from 'remix';

export default function SubscribeForm() {
    return (
        <div className="subscribe-form" id="mc_embed_signup">
            <div className="subscribe-form__info">
                <div>
                    <h2>Subscribe to my newsletter</h2>
                    <p>Subscribe to get my latest content by email.</p>
                </div>
                <img src="/assets/email-icon.png" alt="Email icon" />
            </div>
            <form
                className="subscribe-form__form"
                action="https://herodev.us4.list-manage.com/subscribe/post?u=23fd5221628ea75834fa3f2d4&amp;id=d4a000537f"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                target="_blank"
            >
                <input
                    type="text"
                    name="FNAME"
                    placeholder="Your first name"
                    id="mce-FNAME"
                />
                <input
                    type="email"
                    name="EMAIL"
                    id="mce-EMAIL"
                    placeholder="Your email"
                />
                <div
                    style={{ position: 'absolute', left: '-5000px' }}
                    aria-hidden="true"
                >
                    <input
                        type="text"
                        name="b_23fd5221628ea75834fa3f2d4_d4a000537f"
                        tabIndex={-1}
                        defaultValue=""
                    />
                </div>
                <button type="submit">Subscribe</button>
                <span>I'm not going to send you span :).</span>
            </form>
            <script
                type="text/javascript"
                src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
            ></script>
        </div>
    );
}
