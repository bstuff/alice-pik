import { createRouting, query, segment } from 'ts-routes';

export const routes = createRouting({
  alice: {
    ...segment`/alice/v1.0`,
    children: {
      // user: segment`/browse/${arg('toolId')}`,
      user: {
        ...segment`/user`,
        children: {
          devices: {
            ...segment`/devices`,
            children: {
              action: segment`/action`,
              query: segment`/query`,
            },
          },
          unlink: segment`/unlink`,
        },
      },
    },
  },
  login: {
    ...segment`/login`,
    query: {
      redirect: query('optional'),
    },
    children: {
      ya: {
        ...segment`/ya`,
        children: {
          token: segment`/token`,
        },
      },
    },
  },
  logout: segment`/logout`,
  oauth: {
    ...segment`/oauth`,
    children: {
      ya: {
        ...segment`/ya`,
        children: {
          token: {
            ...segment`/token`,
            query: {
              redirect: query('optional'),
            },
          },
        },
      },
    },
  },
  profile: segment`/profile`,
  services: {
    ...segment`/services`,
    children: {
      pik: {
        ...segment`/pik`,
        children: {
          addUser: segment`/add-user`,
        },
      },
    },
  },
  ya: {
    ...segment`/ya`,
    children: {
      authorize: {
        ...segment`/authorize`,
      },
      login: {
        ...segment`/login`,
        query: {
          redirect: query('optional'),
        },
      },
      devices: {
        ...segment`/devices`,
        query: {
          redirect: query('optional'),
        },
      },
      pik: {
        ...segment`/pik`,
        query: {
          redirect: query('optional'),
        },
      },
    },
  },
});

export function patternToRemixId(pattern: string) {
  return `routes/${pattern.replaceAll('/', '.').replaceAll(':', '$').slice(1)}`;
}
