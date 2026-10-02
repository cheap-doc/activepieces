import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { docCheapAuth } from '../auth';
import { docCheapClient } from '../common/client';

function buildOptions({
  expectCountry,
  returnPortrait,
  retainHours,
}: {
  expectCountry: string | undefined;
  returnPortrait: boolean | undefined;
  retainHours: number | undefined;
}): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  const country = expectCountry?.trim().toUpperCase();
  if (country) {
    if (!/^[A-Z]{3}$/.test(country)) {
      throw new Error(
        'Expected Country must be a three-letter ISO 3166-1 alpha-3 code, such as GBR.'
      );
    }
    options['expect_country'] = country;
  }
  if (returnPortrait !== undefined && returnPortrait !== null) {
    options['return_portrait'] = returnPortrait;
  }
  if (retainHours !== undefined && retainHours !== null) {
    if (!Number.isInteger(retainHours) || retainHours < 0 || retainHours > 8760) {
      throw new Error('Retain Hours must be a whole number from 0 to 8760.');
    }
    options['retain_hours'] = retainHours;
  }
  return options;
}

export const recognizeDocument = createAction({
  name: 'recognize_document',
  classification: 'WRITE',
  auth: docCheapAuth,
  displayName: 'Recognize Document',
  description:
    'Read a passport, ID card or driver’s licence image into structured fields.',
  audience: 'both',
  aiMetadata: {
    description:
      'Sends one image of an identity document (passport, national ID card or driver’s licence) to doc.cheap and returns what is printed on it as structured JSON: status, document type and country, holder name, dates, document number, MRZ and per-field values. Costs one credit ($0.01) only when a document is recognised; an image with no document is free. Not idempotent unless an Idempotency Key is given, in which case repeating the same key returns the first answer without a second charge.',
    idempotent: false,
  },
  props: {
    image: Property.File({
      displayName: 'Image',
      description:
        'A photo or scan of the document (JPEG, PNG or another common image format), as a file or a URL.',
      required: true,
    }),
    expectCountry: Property.ShortText({
      displayName: 'Expected Country',
      description:
        'Three-letter ISO 3166-1 alpha-3 code of the country you expect the document to be from. Leave empty for any country.',
      required: false,
    }),
    returnPortrait: Property.Checkbox({
      displayName: 'Return Portrait',
      description: 'Whether to return the holder’s photo crop in the full answer.',
      required: false,
    }),
    retainHours: Property.Number({
      displayName: 'Retain Hours',
      description:
        'How many hours the result can be read back with Find Scan. 0 keeps nothing. Leave empty to use the account’s own history setting.',
      required: false,
    }),
    reference: Property.ShortText({
      displayName: 'Reference',
      description:
        'Your own label for this scan, such as an order number. It is returned with the result.',
      required: false,
    }),
    idempotencyKey: Property.ShortText({
      displayName: 'Idempotency Key',
      description:
        'A unique string for this document. Sending the same key again returns the first answer instead of charging a second scan.',
      required: false,
    }),
  },
  async run(context) {
    const {
      image,
      expectCountry,
      returnPortrait,
      retainHours,
      reference,
      idempotencyKey,
    } = context.propsValue;
    const body: Record<string, unknown> = { image: image.base64 };
    const options = buildOptions({ expectCountry, returnPortrait, retainHours });
    if (Object.keys(options).length > 0) {
      body['options'] = options;
    }
    const label = reference?.trim();
    if (label) {
      body['reference'] = label;
    }
    const key = idempotencyKey?.trim();
    return docCheapClient.sendRequest({
      apiKey: context.auth.secret_text,
      method: HttpMethod.POST,
      path: '/scans',
      body,
      headers: key ? { 'Idempotency-Key': key } : undefined,
    });
  },
});
