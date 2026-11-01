import { html } from "satori-html";
import { siteConfig } from "@/site.config";

// OG image markup for blog posts
export const ogMarkup = (title: string, pubDate: string) =>
	html`<div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #fefdfc; color: #262625; padding: 64px; justify-content: space-between; border: 8px solid #f4f3ef;">
		<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
			<div style="display: flex; align-items: center;">
				<div style="display: flex; width: 44px; height: 44px; border-radius: 10px; background-color: #262625; align-items: center; justify-content: center; margin-right: 14px;">
					<div style="display: flex; width: 14px; height: 14px; border-radius: 7px; background-color: #16a34a;"></div>
				</div>
				<span style="font-size: 26px; font-weight: 700; color: #262625; letter-spacing: -0.02em;">${siteConfig.title}</span>
			</div>
			<div style="display: flex; align-items: center; padding: 6px 16px; border-radius: 9999px; border: 1px solid #deded8; font-size: 16px; color: #797974;">
				<span>Writing</span>
			</div>
		</div>

		<div style="display: flex; flex-direction: column; width: 100%; margin: auto 0; padding: 32px 0;">
			<span style="font-size: 46px; font-weight: 700; line-height: 1.25; color: #262625; letter-spacing: -0.02em;">${title}</span>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding-top: 24px; border-top: 1px solid #deded8; font-size: 18px; color: #797974;">
			<span style="color: #444441;">${pubDate}</span>
			<span style="font-family: Roboto Mono; color: #16a34a; font-weight: 700;">baliga.dev</span>
		</div>
	</div>`;
