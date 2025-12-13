module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [
      '^/frontend/src($|/)',
      '^/frontend/public($|/)',
      '^/frontend/node_modules($|/)', 
      '^/\\.git($|/)',
      '^/\\.vscode($|/)',
    ],
    icon: 'cms_icon',
    extraResource: ['db/cms.db'],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: 'cms_icon.ico',
        setupExe: 'CostumeManagementSystemInstaller.exe',
      },
    },
  ],
};