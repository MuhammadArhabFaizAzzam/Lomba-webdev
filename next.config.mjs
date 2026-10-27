/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';
const githubPagesBasePath = '/Lomba-webdev';

const nextConfig = {
  output: 'export',
  ...(isGitHubPagesBuild
    ? {
        basePath: githubPagesBasePath,
        assetPrefix: `${githubPagesBasePath}/`,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
