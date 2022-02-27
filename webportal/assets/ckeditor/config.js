/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
  // Define changes to default configuration here. For example:
  config.language = 'vi';
  config.allowedContent = true;
  config.toolbarGroups = [
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
    '/',
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
    {name: 'links', groups: ['links']},
    {name: 'insert', groups: ['insert']},
    '/',
    {name: 'styles', groups: ['styles']},
    {name: 'colors', groups: ['colors']},
    {name: 'tools', groups: ['tools']},
    {name: 'others', groups: ['others']}
  ];
  config.removePlugins = 'elementspath';
  config.resize_enabled = false;
  config.extraPlugins = 'base64image,divarea';
  config.contentsCss = ['body {font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;}'];
  config.autoParagraph = false;
  config.enterMode = 2;
};
// CKEDITOR
//   .create( document.querySelector( '#editor' ), {
//     // ...
//     link: {
//       decorators: {
//         addTargetToExternalLinks: {
//           mode: 'automatic',
//           callback: url => /^(https?:)?\/\//.test( url ),
//           attributes: {
//             target: '_blank',
//             rel: 'noopener noreferrer'
//           }
//         }
//       }
//     }
//   } );
