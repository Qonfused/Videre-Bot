import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { APIMessage } from 'discord.js';
import {
  MESSAGE_LIMITS,
  EMBED_DEFAULTS,
  INTERACTION_RESPONSE_FLAGS,
  COMMAND_OPTION_TYPES,
} from 'constants';

// Shared sanitation context
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * Normalizes and cleans up unsafe strings, eval.
 *
 * @param {String} string Target string.
 */
export const normalize = string => DOMPurify.sanitize(string);

/**
 * Sanitizes Discord syntax from command arguments.
 *
 * @param {String} message Discord message string to sanitize.
 */
export const sanitize = message => {
  if (!message) return;

  return normalize(
    message
      // Remove newline characters
      .replace(/\n/gm, ' ')
      // Remove mentions
      .replace(/<@!\d*>/g, '')
      // Remove formatting
      .replace(/(\*|`|:)*/g, '')
      // Trim inline spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
};

/**
 * Converts a vanilla or camelCase string to SNAKE_CASE.
 */
export const snakeCase = string =>
  string
    .replace(/[A-Z]/g, char => `_${char}`)
    .replace(/\s+|_+/g, '_')
    .toUpperCase();

/**
 * Validates embed fields.
 */
export const validateFields = fields =>
  fields?.reduce((fields, { name, value, ...rest }, index) => {
    if (index < MESSAGE_LIMITS.FIELD_LENGTH)
      fields.push({
        name: name.slice(0, MESSAGE_LIMITS.FIELD_NAME_LENGTH),
        value: value.slice(0, MESSAGE_LIMITS.FIELD_VALUE_LENGTH),
        ...rest,
      });

    return fields;
  }, []);

/**
 * Validates and generates an embed with default properties.
 */
export const validateEmbed = ({ url, title, description, fields, ...rest }) => ({
  ...EMBED_DEFAULTS,
  url,
  title: title?.slice(0, MESSAGE_LIMITS.TITLE_LENGTH),
  description: description?.slice(0, MESSAGE_LIMITS.DESC_LENGTH),
  fields: validateFields(fields),
  ...rest,
});

/**
 * Parses and validates an interaction flags object.
 */
export const validateFlags = flags =>
  Object.keys(flags).reduce(
    (previous, flag) => INTERACTION_RESPONSE_FLAGS[snakeCase(flag)] || previous,
    null
  );

/**
 * Validates a message object or response and its flags.
 */
export const validateMessage = message => {
  // No-op on empty or pre-processed message
  if (!message || message instanceof APIMessage) return message;

  // Early return if evaluating message string
  if (typeof message === 'string')
    return { content: message.slice(0, MESSAGE_LIMITS.CONTENT_LENGTH) };

  // Handle message object and inline specifiers
  return {
    files: message.files,
    tts: Boolean(message.tts),
    flags: validateFlags(message.flags || message),
    content: message.content?.slice(0, MESSAGE_LIMITS.CONTENT_LENGTH) || '',
    embeds: message.content ? null : [message.embeds || message].map(validateEmbed),
  };
};

/**
 * Validates human-readable command meta into a Discord-ready object.
 */
export const validateCommand = ({ name, description, options }) => ({
  name,
  description,
  options: options?.map(({ type, ...rest }) => ({
    type: COMMAND_OPTION_TYPES[snakeCase(type)],
    ...rest,
  })),
});
