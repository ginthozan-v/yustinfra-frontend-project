// Default pages per role
const defaultPages = {
  Admin: "/dashboard",
  Manager: "/project",
  Client: "/project",
};

// Restricted pages per role
const restrictedPages = {
  Admin: [],
  Manager: [
    "/dashboard",
    "/form/create-form-template",
    "/form/settings/:id",
    "/form/form-details/:id",
    "/form/:id",
    "/form",
    "/account/users",
    "/account/my-company",
    "/account/user-groups",
  ],
  Client: [
    "/dashboard",
    "/form/create-form-template",
    "/form/settings/:id",
    "/form/form-details/:id",
    "/form/:id",
    "/form",
    "/account/users",
    "/account/my-company",
    "/account/user-groups",
  ],
};

export const isPageRestrictedForRole = (role, page) => {
  const pages = restrictedPages[role] || [];

  if (pages.includes(page)) return true;

  // Check dynamic routes
  for (const restrictedPage of pages) {
    const dynamicPageRegex = new RegExp(
      `^${restrictedPage.replace(/:\w+/g, "\\d+")}$`
    );
    if (dynamicPageRegex.test(page)) {
      return true;
    }
  }

  return false;
};

export const redirectToDefaultPage = (role, router) => {
  console.log(defaultPages[role]);
  const defaultPage = defaultPages[role] || "/dashboard";
  router.push(defaultPage);
};
