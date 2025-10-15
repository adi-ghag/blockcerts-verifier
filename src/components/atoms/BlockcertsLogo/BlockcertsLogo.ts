import { html } from '@polymer/lit-element';
import CSS from './_components.blockcerts-logo-css';
import getText from '../../../i18n/getText';
import type { TemplateResult } from 'lit-html';

function simpleLogo (): TemplateResult {
  return html`
    <img class='buv-qa-logo--simple  buv-c-logo--small' viewBox="0 0 113 16" version="1.1" src="./lg_bxb_rgb_72_dpi_positiv.png">
    <span class='buv-u-visually-hidden'>${getText('text.brandname')}</span>
  `;
}

export function logoWithBranding (): TemplateResult {
  return html`
    <img class='buv-qa-logo--branded  buv-c-logo--medium' version="1.1" viewBox="0 0 686 163" src="./lg_bxb_rgb_72_dpi_positiv.png">
    <span class='buv-u-visually-hidden'>${getText('text.motto')}</span>
  `;
}

const BlockcertsLogo = ({ className = '', showMotto = false }: { className?: string; showMotto?: boolean } = {
  className: '',
  showMotto: false
}): TemplateResult => {
  return html`
    ${CSS}
    <a href='https://bloxberg.org' title='${getText('text.blockcertsHint')}' class$='buv-c-logo  ${className}'>
      ${
        showMotto
          ? logoWithBranding()
          : simpleLogo()
      }
    </a>`;
};

export default BlockcertsLogo;
