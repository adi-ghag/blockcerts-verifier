import { html } from '@polymer/lit-element';
import type { TemplateResult } from 'lit-html';

/** FormattedMetadataItem
 * return link for uri, email, phone number to apply in Metadata viewer
 * @param metadataObject: the object to be rendered.
 * @param value: String. link value
 * @returns string
 */
// TODO: define metadata object as it's supposed to be (see cert-issuer python checks)
export default function FormattedMetadataItem (metadataObject: any, value: string): TemplateResult {
  const { format, title } = metadataObject;
  let { type } = metadataObject;

  if (Array.isArray(type)) {
    type = type[0];
  }

  const titleHtml = html`<dt class='buv-c-metadata-list__title'>${title}</dt>`;

  let useTargetBlank = false;
  let hrefValue = '';
  let linkWrap = html`${value}`;
  if (type === 'string') {
    switch (format) {
      case 'uri':
        useTargetBlank = true;
        hrefValue = value;
        break;
      case 'email':
        hrefValue = `mailto:${value}`;
        break;
      case 'phoneNumber':
        hrefValue = `tel:${value}`;
        break;
    }
  }

  if (hrefValue) {
    linkWrap = html`<a href="${hrefValue}" target="${useTargetBlank ? '_blank' : ''}" >${value}</a>`;
  }
  // TODO: check for types other than string

  const valueHtml = html`<dd class='buv-c-metadata-list__detail'>
            <pre class='buv-c-metadata-list__detail-text'>${linkWrap}</pre></dd>`;
  return html`${titleHtml}${valueHtml}`;
}
