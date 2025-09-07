/**
 * 簡化版語言標籤插件 - 只支援自動判斷
 * Based on the discussion at https://github.com/expressive-code/expressive-code/issues/153#issuecomment-2282218684
 */
import { definePlugin } from "@expressive-code/core";

export function pluginLanguageBadge() {
	return definePlugin({
		name: "Language Badge",
		baseStyles: () => `
      [data-language]::before {
        position: absolute;
        z-index: 2;
        right: 0.5rem;
        top: 0.5rem;
        padding: 0.1rem 0.5rem;
        content: attr(data-language);
        font-family: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: oklch(0.75 0.1 var(--hue));
        background: oklch(0.33 0.035 var(--hue));
        border-radius: 0.5rem;
        pointer-events: none;
        transition: opacity 0.3s;
        opacity: 0;
      }
      
      /* 程式語言預設顯示標籤（除了有標題的） */
      .frame[data-language]:not(.has-title) {
        @media (hover: none) {
          & [data-language]::before {
            opacity: 1;
            margin-right: 3rem;
          }
          & [data-language]:active::before {
            opacity: 0;
          }
        }
        @media (hover: hover) {
          & [data-language]::before {
            opacity: 1;
          }
          &:hover [data-language]::before {
            opacity: 0;
          }
        }
      }
      
      /* 終端機語言隱藏標籤 */
      .frame[data-language="bash"],
      .frame[data-language="sh"],
      .frame[data-language="shell"],
      .frame[data-language="zsh"],
      .frame[data-language="fish"],
      .frame[data-language="powershell"],
      .frame[data-language="ps1"],
      .frame[data-language="shellsession"],
      .frame[data-language="console"] {
        & [data-language]::before {
          opacity: 0 !important;
        }
      }
    `,
	});
}