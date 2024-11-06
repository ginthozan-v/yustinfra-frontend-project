/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'admin-yustinfra.oldevops.nl',
      'yust-infra.s3.amazonaws.com',
      'yust-infra.s3.eu-central-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
