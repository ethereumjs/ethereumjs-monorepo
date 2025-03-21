const ReposBranchesList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          author: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          ordering: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Which field to use when ordering the results.',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'branch name' },
              updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
            },
            required: ['name', 'updatestamp'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposBranchesRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name',
          },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['name', 'owner_username', 'repo_name', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'branch name' },
        updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
        head_commit: {
          readOnly: true,
          title: "branch's current head commit",
          type: 'object',
          required: [
            'author',
            'branch',
            'ci_passed',
            'commitid',
            'message',
            'parent',
            'report',
            'state',
            'timestamp',
            'totals',
          ],
          properties: {
            commitid: { type: 'string', title: 'commit SHA' },
            message: { type: 'string', title: 'commit message' },
            timestamp: {
              type: 'string',
              format: 'date-time',
              title: 'timestamp when commit was made',
            },
            ci_passed: {
              type: 'boolean',
              title: 'indicates whether the CI process passed for this commit',
            },
            author: {
              title: 'author of the commit',
              type: 'object',
              required: ['name', 'service', 'username'],
              properties: {
                service: {
                  readOnly: true,
                  enum: [
                    'github',
                    'gitlab',
                    'bitbucket',
                    'github_enterprise',
                    'gitlab_enterprise',
                    'bitbucket_server',
                  ],
                  type: 'string',
                  description:
                    '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                },
                username: { type: 'string', readOnly: true },
                name: { type: 'string', readOnly: true },
              },
            },
            branch: { type: 'string', title: 'branch name on which this commit currently lives' },
            totals: {
              title: 'coverage totals',
              type: 'object',
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: {
                  type: 'integer',
                  readOnly: true,
                  title:
                    'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                },
              },
            },
            state: {
              title: 'Codecov processing state for this commit',
              enum: ['complete', 'pending', 'error', 'skipped'],
              type: 'string',
              description:
                '* `complete` - Complete\n* `pending` - Pending\n* `error` - Error\n* `skipped` - Skipped\n\n`complete` `pending` `error` `skipped`',
            },
            parent: { type: 'string', title: 'commit SHA of first ancestor commit with coverage' },
            report: {
              title: 'coverage report',
              type: 'object',
              required: ['files', 'totals'],
              properties: {
                totals: {
                  title: 'coverage totals',
                  type: 'object',
                  required: [
                    'branches',
                    'complexity',
                    'complexity_ratio',
                    'complexity_total',
                    'coverage',
                    'diff',
                    'files',
                    'hits',
                    'lines',
                    'messages',
                    'methods',
                    'misses',
                    'partials',
                    'sessions',
                  ],
                  properties: {
                    files: { type: 'integer' },
                    lines: { type: 'integer' },
                    hits: { type: 'integer' },
                    misses: { type: 'integer' },
                    partials: { type: 'integer' },
                    coverage: {
                      type: 'number',
                      format: 'double',
                      readOnly: true,
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    branches: { type: 'integer' },
                    methods: { type: 'integer' },
                    messages: { type: 'integer' },
                    sessions: { type: 'integer' },
                    complexity: {
                      type: 'number',
                      format: 'double',
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    complexity_total: {
                      type: 'number',
                      format: 'double',
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    complexity_ratio: {
                      type: 'number',
                      format: 'double',
                      readOnly: true,
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    diff: { type: 'object', additionalProperties: true },
                  },
                },
                files: {
                  readOnly: true,
                  title: 'file specific coverage totals',
                  type: 'object',
                  required: ['line_coverage', 'name', 'totals'],
                  properties: {
                    name: { type: 'string', title: 'file path' },
                    totals: {
                      title: 'coverage totals',
                      type: 'object',
                      required: [
                        'branches',
                        'complexity',
                        'complexity_ratio',
                        'complexity_total',
                        'coverage',
                        'diff',
                        'files',
                        'hits',
                        'lines',
                        'messages',
                        'methods',
                        'misses',
                        'partials',
                        'sessions',
                      ],
                      properties: {
                        files: { type: 'integer' },
                        lines: { type: 'integer' },
                        hits: { type: 'integer' },
                        misses: { type: 'integer' },
                        partials: { type: 'integer' },
                        coverage: {
                          type: 'number',
                          format: 'double',
                          readOnly: true,
                          minimum: -1.7976931348623157e308,
                          maximum: 1.7976931348623157e308,
                        },
                        branches: { type: 'integer' },
                        methods: { type: 'integer' },
                        messages: { type: 'integer' },
                        sessions: { type: 'integer' },
                        complexity: {
                          type: 'number',
                          format: 'double',
                          minimum: -1.7976931348623157e308,
                          maximum: 1.7976931348623157e308,
                        },
                        complexity_total: {
                          type: 'number',
                          format: 'double',
                          minimum: -1.7976931348623157e308,
                          maximum: 1.7976931348623157e308,
                        },
                        complexity_ratio: {
                          type: 'number',
                          format: 'double',
                          readOnly: true,
                          minimum: -1.7976931348623157e308,
                          maximum: 1.7976931348623157e308,
                        },
                        diff: { type: 'object', additionalProperties: true },
                      },
                    },
                    line_coverage: {
                      type: 'array',
                      readOnly: true,
                      title: 'line-by-line coverage values',
                      items: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
      required: ['head_commit', 'name', 'updatestamp'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCommitsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              commitid: { type: 'string', title: 'commit SHA' },
              message: { type: 'string', title: 'commit message' },
              timestamp: {
                type: 'string',
                format: 'date-time',
                title: 'timestamp when commit was made',
              },
              ci_passed: {
                type: 'boolean',
                title: 'indicates whether the CI process passed for this commit',
              },
              author: {
                title: 'author of the commit',
                type: 'object',
                required: ['name', 'service', 'username'],
                properties: {
                  service: {
                    readOnly: true,
                    enum: [
                      'github',
                      'gitlab',
                      'bitbucket',
                      'github_enterprise',
                      'gitlab_enterprise',
                      'bitbucket_server',
                    ],
                    type: 'string',
                    description:
                      '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                  },
                  username: { type: 'string', readOnly: true },
                  name: { type: 'string', readOnly: true },
                },
              },
              branch: { type: 'string', title: 'branch name on which this commit currently lives' },
              totals: {
                title: 'coverage totals',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
              state: {
                title: 'Codecov processing state for this commit',
                enum: ['complete', 'pending', 'error', 'skipped'],
                type: 'string',
                description:
                  '* `complete` - Complete\n* `pending` - Pending\n* `error` - Error\n* `skipped` - Skipped\n\n`complete` `pending` `error` `skipped`',
              },
              parent: {
                type: 'string',
                title: 'commit SHA of first ancestor commit with coverage',
              },
            },
            required: [
              'author',
              'branch',
              'ci_passed',
              'commitid',
              'message',
              'parent',
              'state',
              'timestamp',
              'totals',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCommitsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          commitid: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA',
          },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['commitid', 'owner_username', 'repo_name', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        commitid: { type: 'string', title: 'commit SHA' },
        message: { type: 'string', title: 'commit message' },
        timestamp: { type: 'string', format: 'date-time', title: 'timestamp when commit was made' },
        ci_passed: {
          type: 'boolean',
          title: 'indicates whether the CI process passed for this commit',
        },
        author: {
          title: 'author of the commit',
          type: 'object',
          required: ['name', 'service', 'username'],
          properties: {
            service: {
              readOnly: true,
              enum: [
                'github',
                'gitlab',
                'bitbucket',
                'github_enterprise',
                'gitlab_enterprise',
                'bitbucket_server',
              ],
              type: 'string',
              description:
                '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
            },
            username: { type: 'string', readOnly: true },
            name: { type: 'string', readOnly: true },
          },
        },
        branch: { type: 'string', title: 'branch name on which this commit currently lives' },
        totals: {
          title: 'coverage totals',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: {
              type: 'integer',
              readOnly: true,
              title:
                'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
            },
          },
        },
        state: {
          title: 'Codecov processing state for this commit',
          enum: ['complete', 'pending', 'error', 'skipped'],
          type: 'string',
          description:
            '* `complete` - Complete\n* `pending` - Pending\n* `error` - Error\n* `skipped` - Skipped\n\n`complete` `pending` `error` `skipped`',
        },
        parent: { type: 'string', title: 'commit SHA of first ancestor commit with coverage' },
        report: {
          title: 'coverage report',
          type: 'object',
          required: ['files', 'totals'],
          properties: {
            totals: {
              title: 'coverage totals',
              type: 'object',
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
            },
            files: {
              readOnly: true,
              title: 'file specific coverage totals',
              type: 'object',
              required: ['line_coverage', 'name', 'totals'],
              properties: {
                name: { type: 'string', title: 'file path' },
                totals: {
                  title: 'coverage totals',
                  type: 'object',
                  required: [
                    'branches',
                    'complexity',
                    'complexity_ratio',
                    'complexity_total',
                    'coverage',
                    'diff',
                    'files',
                    'hits',
                    'lines',
                    'messages',
                    'methods',
                    'misses',
                    'partials',
                    'sessions',
                  ],
                  properties: {
                    files: { type: 'integer' },
                    lines: { type: 'integer' },
                    hits: { type: 'integer' },
                    misses: { type: 'integer' },
                    partials: { type: 'integer' },
                    coverage: {
                      type: 'number',
                      format: 'double',
                      readOnly: true,
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    branches: { type: 'integer' },
                    methods: { type: 'integer' },
                    messages: { type: 'integer' },
                    sessions: { type: 'integer' },
                    complexity: {
                      type: 'number',
                      format: 'double',
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    complexity_total: {
                      type: 'number',
                      format: 'double',
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    complexity_ratio: {
                      type: 'number',
                      format: 'double',
                      readOnly: true,
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                    },
                    diff: { type: 'object', additionalProperties: true },
                  },
                },
                line_coverage: {
                  type: 'array',
                  readOnly: true,
                  title: 'line-by-line coverage values',
                  items: {},
                },
              },
            },
          },
        },
      },
      required: [
        'author',
        'branch',
        'ci_passed',
        'commitid',
        'message',
        'parent',
        'report',
        'state',
        'timestamp',
        'totals',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCommitsUploadsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          commitid: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA',
          },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['commitid', 'owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
              storage_path: { type: 'string' },
              flags: { type: 'array', items: { type: 'string' } },
              provider: { type: 'string' },
              build_code: { type: 'string' },
              name: { type: 'string' },
              job_code: { type: 'string' },
              build_url: { type: 'string' },
              state: { type: 'string' },
              env: { type: 'object', additionalProperties: true },
              upload_type: { type: 'string' },
              upload_extras: { type: 'object', additionalProperties: true },
              totals: {
                type: 'object',
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                },
                required: [
                  'branches',
                  'coverage',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                ],
              },
            },
            required: [
              'build_code',
              'build_url',
              'created_at',
              'env',
              'flags',
              'job_code',
              'name',
              'provider',
              'state',
              'storage_path',
              'totals',
              'updated_at',
              'upload_extras',
              'upload_type',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareComponentsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        component_id: { type: 'string' },
        name: { type: 'string' },
        base_report_totals: {
          type: 'object',
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
        },
        head_report_totals: {
          type: 'object',
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
        },
        diff_totals: {
          type: 'object',
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
        },
      },
      required: ['base_report_totals', 'component_id', 'diff_totals', 'head_report_totals', 'name'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareFileRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'file path',
          },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['file_path', 'owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'object', additionalProperties: true },
        totals: {
          type: 'object',
          properties: {
            base: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            head: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            patch: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
          },
          required: ['base', 'head', 'patch'],
        },
        has_diff: { type: 'boolean' },
        stats: { type: 'object', additionalProperties: true },
        change_summary: { type: 'object', additionalProperties: true },
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              number: { type: 'object', additionalProperties: true },
              coverage: { type: 'object', additionalProperties: true },
              is_diff: { type: 'boolean' },
              added: { type: 'boolean' },
              removed: { type: 'boolean' },
              sessions: { type: 'integer' },
            },
            required: ['added', 'coverage', 'is_diff', 'number', 'removed', 'sessions', 'value'],
          },
        },
      },
      required: ['change_summary', 'has_diff', 'lines', 'name', 'stats', 'totals'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareFlagsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'string' },
        base_report_totals: { type: 'string', readOnly: true },
        head_report_totals: {
          type: 'object',
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
        },
        diff_totals: {
          type: 'object',
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
        },
      },
      required: ['base_report_totals', 'diff_totals', 'head_report_totals', 'name'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareImpactedFilesRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        base_commit: { type: 'string' },
        head_commit: { type: 'string' },
        totals: {
          type: 'object',
          properties: {
            base: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            head: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            patch: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
          },
          required: ['base', 'head', 'patch'],
        },
        commit_uploads: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              commitid: { type: 'string', title: 'commit SHA' },
              message: { type: 'string', title: 'commit message' },
              timestamp: {
                type: 'string',
                format: 'date-time',
                title: 'timestamp when commit was made',
              },
              ci_passed: {
                type: 'boolean',
                title: 'indicates whether the CI process passed for this commit',
              },
              author: {
                title: 'author of the commit',
                type: 'object',
                required: ['name', 'service', 'username'],
                properties: {
                  service: {
                    readOnly: true,
                    enum: [
                      'github',
                      'gitlab',
                      'bitbucket',
                      'github_enterprise',
                      'gitlab_enterprise',
                      'bitbucket_server',
                    ],
                    type: 'string',
                    description:
                      '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                  },
                  username: { type: 'string', readOnly: true },
                  name: { type: 'string', readOnly: true },
                },
              },
              branch: { type: 'string', title: 'branch name on which this commit currently lives' },
              totals: {
                title: 'coverage totals',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
              state: {
                title: 'Codecov processing state for this commit',
                enum: ['complete', 'pending', 'error', 'skipped'],
                type: 'string',
                description:
                  '* `complete` - Complete\n* `pending` - Pending\n* `error` - Error\n* `skipped` - Skipped\n\n`complete` `pending` `error` `skipped`',
              },
              parent: {
                type: 'string',
                title: 'commit SHA of first ancestor commit with coverage',
              },
            },
            required: [
              'author',
              'branch',
              'ci_passed',
              'commitid',
              'message',
              'parent',
              'state',
              'timestamp',
              'totals',
            ],
          },
        },
        diff: { type: 'object', additionalProperties: true, readOnly: true },
        files: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
          readOnly: true,
        },
        untracked: { type: 'array', items: { type: 'string' }, readOnly: true },
        state: { type: 'string', readOnly: true },
      },
      required: [
        'base_commit',
        'commit_uploads',
        'diff',
        'files',
        'head_commit',
        'state',
        'totals',
        'untracked',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        base_commit: { type: 'string' },
        head_commit: { type: 'string' },
        totals: {
          type: 'object',
          properties: {
            base: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            head: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
            patch: {
              type: 'object',
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
            },
          },
          required: ['base', 'head', 'patch'],
        },
        commit_uploads: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              commitid: { type: 'string', title: 'commit SHA' },
              message: { type: 'string', title: 'commit message' },
              timestamp: {
                type: 'string',
                format: 'date-time',
                title: 'timestamp when commit was made',
              },
              ci_passed: {
                type: 'boolean',
                title: 'indicates whether the CI process passed for this commit',
              },
              author: {
                title: 'author of the commit',
                type: 'object',
                required: ['name', 'service', 'username'],
                properties: {
                  service: {
                    readOnly: true,
                    enum: [
                      'github',
                      'gitlab',
                      'bitbucket',
                      'github_enterprise',
                      'gitlab_enterprise',
                      'bitbucket_server',
                    ],
                    type: 'string',
                    description:
                      '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                  },
                  username: { type: 'string', readOnly: true },
                  name: { type: 'string', readOnly: true },
                },
              },
              branch: { type: 'string', title: 'branch name on which this commit currently lives' },
              totals: {
                title: 'coverage totals',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
              state: {
                title: 'Codecov processing state for this commit',
                enum: ['complete', 'pending', 'error', 'skipped'],
                type: 'string',
                description:
                  '* `complete` - Complete\n* `pending` - Pending\n* `error` - Error\n* `skipped` - Skipped\n\n`complete` `pending` `error` `skipped`',
              },
              parent: {
                type: 'string',
                title: 'commit SHA of first ancestor commit with coverage',
              },
            },
            required: [
              'author',
              'branch',
              'ci_passed',
              'commitid',
              'message',
              'parent',
              'state',
              'timestamp',
              'totals',
            ],
          },
        },
        diff: { type: 'object', additionalProperties: true, readOnly: true },
        files: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
          readOnly: true,
        },
        untracked: { type: 'array', items: { type: 'string' }, readOnly: true },
      },
      required: [
        'base_commit',
        'commit_uploads',
        'diff',
        'files',
        'head_commit',
        'totals',
        'untracked',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCompareSegmentsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'file path',
          },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['file_path', 'owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'base commit SHA (`head` also required)',
          },
          head: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'head commit SHA (`base` also required)',
          },
          pullid: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description:
              'pull ID on which to perform the comparison (alternative to specifying `base` and `head`)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        segments: {
          readOnly: true,
          type: 'object',
          required: ['has_unintended_changes', 'header', 'lines'],
          properties: {
            header: { type: 'string', readOnly: true },
            has_unintended_changes: { type: 'boolean' },
            lines: { type: 'array', readOnly: true, items: {} },
          },
        },
      },
      required: ['segments'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposComponentsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name for which to return components (of head commit)',
          },
          sha: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA for which to return components',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          component_id: { type: 'string' },
          name: { type: 'string', title: 'component name' },
          coverage: {
            type: 'number',
            format: 'double',
            title: 'component coverage',
            minimum: -1.7976931348623157e308,
            maximum: 1.7976931348623157e308,
          },
        },
        required: ['component_id', 'coverage', 'name'],
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposConfigRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        upload_token: {
          type: 'string',
          title: 'token used for uploading coverage reports for this repo',
        },
        graph_token: { type: 'string', title: 'token used for repository graphs' },
      },
      required: ['graph_token', 'upload_token'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposCoverageList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name',
          },
          end_date: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'end datetime (inclusive)',
          },
          interval: {
            type: 'string',
            enum: ['1d', '30d', '7d'],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: '* `1d` - 1 day\n* `7d` - 7 day\n* `30d` - 30 day',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
          start_date: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'start datetime (inclusive)',
          },
        },
        required: ['interval'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
                title: 'timestamp at the start of the interval',
              },
              min: {
                type: 'number',
                format: 'double',
                title: 'minimum value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              max: {
                type: 'number',
                format: 'double',
                title: 'maximum value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              avg: {
                type: 'number',
                format: 'double',
                title: 'average value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
            },
            required: ['avg', 'max', 'min', 'timestamp'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposFileReportRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'the file path for which to retrieve coverage info',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'path', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name for which to return report (of head commit)',
          },
          sha: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA for which to return report',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'file path' },
        totals: {
          title: 'coverage totals',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
        },
        line_coverage: {
          type: 'array',
          items: {},
          readOnly: true,
          title: 'line-by-line coverage values',
        },
        commit_sha: {
          type: 'string',
          readOnly: true,
          title: 'commit SHA of the commit for which coverage info was found',
        },
        commit_file_url: {
          type: 'string',
          readOnly: true,
          title: 'Codecov URL to see file coverage on commit.',
        },
      },
      required: ['commit_file_url', 'commit_sha', 'line_coverage', 'name', 'totals'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposFlagsCoverageList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          flag_name: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['flag_name', 'owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name',
          },
          end_date: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'end datetime (inclusive)',
          },
          interval: {
            type: 'string',
            enum: ['1d', '30d', '7d'],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: '* `1d` - 1 day\n* `7d` - 7 day\n* `30d` - 30 day',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
          start_date: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'start datetime (inclusive)',
          },
        },
        required: ['interval'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
                title: 'timestamp at the start of the interval',
              },
              min: {
                type: 'number',
                format: 'double',
                title: 'minimum value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              max: {
                type: 'number',
                format: 'double',
                title: 'maximum value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              avg: {
                type: 'number',
                format: 'double',
                title: 'average value in the interval',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
            },
            required: ['avg', 'max', 'min', 'timestamp'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposFlagsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              flag_name: { type: 'string' },
              coverage: {
                type: 'number',
                format: 'double',
                title: 'flag coverage',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
            },
            required: ['coverage', 'flag_name'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'service'],
      },
      {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'whether the repository has received an upload',
          },
          names: {
            type: 'array',
            items: { type: 'string' },
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'list of repository names',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
          search: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A search term.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'repository name' },
              private: { type: 'boolean', title: 'indicates private vs. public repository' },
              updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
              author: {
                title: 'repository owner',
                type: 'object',
                required: ['name', 'service', 'username'],
                properties: {
                  service: {
                    readOnly: true,
                    enum: [
                      'github',
                      'gitlab',
                      'bitbucket',
                      'github_enterprise',
                      'gitlab_enterprise',
                      'bitbucket_server',
                    ],
                    type: 'string',
                    description:
                      '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                  },
                  username: { type: 'string', readOnly: true },
                  name: { type: 'string', readOnly: true },
                },
              },
              language: { type: 'string', title: 'primary programming language used' },
              branch: { type: 'string', title: 'default branch name' },
              active: {
                type: 'boolean',
                title: 'indicates whether the repository has received a coverage upload',
              },
              activated: {
                type: 'boolean',
                title: 'indicates whether the repository has been manually deactivated',
              },
              totals: {
                title: 'recent commit totals on the default branch',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
            },
            required: [
              'activated',
              'active',
              'author',
              'branch',
              'language',
              'name',
              'private',
              'totals',
              'updatestamp',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposPullsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          ordering: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Which field to use when ordering the results.',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
          start_date: {
            type: 'string',
            format: 'date-time',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'only return pulls with updatestamp on or after this date',
          },
          state: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'the state of the pull (open/merged/closed)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pullid: { type: 'integer', title: 'pull ID number' },
              title: { type: 'string', title: 'title of the pull' },
              base_totals: {
                title: 'coverage totals of base commit',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
              head_totals: {
                title: 'coverage totals of head commit',
                type: 'object',
                required: [
                  'branches',
                  'complexity',
                  'complexity_ratio',
                  'complexity_total',
                  'coverage',
                  'diff',
                  'files',
                  'hits',
                  'lines',
                  'methods',
                  'misses',
                  'partials',
                  'sessions',
                ],
                properties: {
                  files: { type: 'integer' },
                  lines: { type: 'integer' },
                  hits: { type: 'integer' },
                  misses: { type: 'integer' },
                  partials: { type: 'integer' },
                  coverage: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  branches: { type: 'integer' },
                  methods: { type: 'integer' },
                  sessions: { type: 'integer' },
                  complexity: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_total: {
                    type: 'number',
                    format: 'double',
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  complexity_ratio: {
                    type: 'number',
                    format: 'double',
                    readOnly: true,
                    minimum: -1.7976931348623157e308,
                    maximum: 1.7976931348623157e308,
                  },
                  diff: {
                    type: 'integer',
                    readOnly: true,
                    title:
                      'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
                  },
                },
              },
              updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
              state: {
                title: 'state of the pull',
                enum: ['open', 'merged', 'closed'],
                type: 'string',
                description:
                  '* `open` - Open\n* `merged` - Merged\n* `closed` - Closed\n\n`open` `merged` `closed`',
              },
              ci_passed: {
                type: 'boolean',
                title: 'indicates whether the CI process passed for the head commit of this pull',
              },
              author: {
                title: 'pull author',
                type: 'object',
                required: ['name', 'service', 'username'],
                properties: {
                  service: {
                    readOnly: true,
                    enum: [
                      'github',
                      'gitlab',
                      'bitbucket',
                      'github_enterprise',
                      'gitlab_enterprise',
                      'bitbucket_server',
                    ],
                    type: 'string',
                    description:
                      '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
                  },
                  username: { type: 'string', readOnly: true },
                  name: { type: 'string', readOnly: true },
                },
              },
            },
            required: [
              'author',
              'base_totals',
              'ci_passed',
              'head_totals',
              'pullid',
              'state',
              'title',
              'updatestamp',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposPullsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          pullid: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'pull ID',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'pullid', 'repo_name', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        pullid: { type: 'integer', title: 'pull ID number' },
        title: { type: 'string', title: 'title of the pull' },
        base_totals: {
          title: 'coverage totals of base commit',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: {
              type: 'integer',
              readOnly: true,
              title:
                'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
            },
          },
        },
        head_totals: {
          title: 'coverage totals of head commit',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: {
              type: 'integer',
              readOnly: true,
              title:
                'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
            },
          },
        },
        updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
        state: {
          title: 'state of the pull',
          enum: ['open', 'merged', 'closed'],
          type: 'string',
          description:
            '* `open` - Open\n* `merged` - Merged\n* `closed` - Closed\n\n`open` `merged` `closed`',
        },
        ci_passed: {
          type: 'boolean',
          title: 'indicates whether the CI process passed for the head commit of this pull',
        },
        author: {
          title: 'pull author',
          type: 'object',
          required: ['name', 'service', 'username'],
          properties: {
            service: {
              readOnly: true,
              enum: [
                'github',
                'gitlab',
                'bitbucket',
                'github_enterprise',
                'gitlab_enterprise',
                'bitbucket_server',
              ],
              type: 'string',
              description:
                '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
            },
            username: { type: 'string', readOnly: true },
            name: { type: 'string', readOnly: true },
          },
        },
      },
      required: [
        'author',
        'base_totals',
        'ci_passed',
        'head_totals',
        'pullid',
        'state',
        'title',
        'updatestamp',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposReportRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name for which to return report (of head commit)',
          },
          component_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given component id',
          },
          flag: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given flag name',
          },
          path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include file paths starting with this value',
          },
          sha: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA for which to return report',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        totals: {
          title: 'coverage totals',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
        },
        files: {
          readOnly: true,
          title: 'file specific coverage totals',
          type: 'object',
          required: ['line_coverage', 'name', 'totals'],
          properties: {
            name: { type: 'string', title: 'file path' },
            totals: {
              title: 'coverage totals',
              type: 'object',
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
            },
            line_coverage: {
              type: 'array',
              readOnly: true,
              title: 'line-by-line coverage values',
              items: {},
            },
          },
        },
        commit_file_url: {
          type: 'string',
          title:
            'Codecov url to see file coverage on commit. Can be unreliable with partial path names.',
        },
      },
      required: ['commit_file_url', 'files', 'totals'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposReportTreeRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name for which to return report (of head commit)',
          },
          component_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given component id',
          },
          depth: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'depth of the traversal (default=1)',
          },
          flag: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given flag name',
          },
          path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'starting path of the traversal (default is root path)',
          },
          sha: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA for which to return report',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'string' },
        full_path: { type: 'string' },
        coverage: {
          type: 'number',
          format: 'double',
          minimum: -1.7976931348623157e308,
          maximum: 1.7976931348623157e308,
        },
        lines: { type: 'integer' },
        hits: { type: 'integer' },
        partials: { type: 'integer' },
        misses: { type: 'integer' },
      },
      required: ['coverage', 'full_path', 'hits', 'lines', 'misses', 'name', 'partials'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'repository name' },
        private: { type: 'boolean', title: 'indicates private vs. public repository' },
        updatestamp: { type: 'string', format: 'date-time', title: 'last updated timestamp' },
        author: {
          title: 'repository owner',
          type: 'object',
          required: ['name', 'service', 'username'],
          properties: {
            service: {
              readOnly: true,
              enum: [
                'github',
                'gitlab',
                'bitbucket',
                'github_enterprise',
                'gitlab_enterprise',
                'bitbucket_server',
              ],
              type: 'string',
              description:
                '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
            },
            username: { type: 'string', readOnly: true },
            name: { type: 'string', readOnly: true },
          },
        },
        language: { type: 'string', title: 'primary programming language used' },
        branch: { type: 'string', title: 'default branch name' },
        active: {
          type: 'boolean',
          title: 'indicates whether the repository has received a coverage upload',
        },
        activated: {
          type: 'boolean',
          title: 'indicates whether the repository has been manually deactivated',
        },
        totals: {
          title: 'recent commit totals on the default branch',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: {
              type: 'integer',
              readOnly: true,
              title:
                'Deprecated: this will always return 0.  Please use comparison endpoint for diff totals instead.',
            },
          },
        },
      },
      required: [
        'activated',
        'active',
        'author',
        'branch',
        'language',
        'name',
        'private',
        'totals',
        'updatestamp',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposTestResultsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          repo_name: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          service: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Branch name for which to return test results',
          },
          commit_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Commit SHA for which to return test results',
          },
          duration_max: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Maximum duration of the test in seconds',
          },
          duration_min: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Minimum duration of the test in seconds',
          },
          outcome: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Status of the test (failure, skip, error, pass)',
          },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              test_id: { type: 'string' },
              failure_message: { type: 'string', title: 'test name' },
              duration_seconds: {
                type: 'number',
                format: 'double',
                title: 'duration in seconds',
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              commitid: { type: 'string', title: 'commit SHA' },
              outcome: { type: 'string' },
              branch: { type: 'string', title: 'branch name' },
              repoid: { type: 'integer', title: 'repo id' },
              failure_rate: {
                type: 'number',
                format: 'double',
                readOnly: true,
                minimum: -1.7976931348623157e308,
                maximum: 1.7976931348623157e308,
              },
              name: { type: 'string', readOnly: true, title: 'test name' },
              commits_where_fail: {
                type: 'array',
                items: {},
                readOnly: true,
                title: 'commits where test failed',
              },
            },
            required: [
              'branch',
              'commitid',
              'commits_where_fail',
              'duration_seconds',
              'failure_message',
              'failure_rate',
              'id',
              'name',
              'outcome',
              'repoid',
              'test_id',
            ],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposTestResultsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Test instance ID',
          },
          owner_username: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          repo_name: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
          service: { type: 'string', $schema: 'http://json-schema.org/draft-04/schema#' },
        },
        required: ['id', 'owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Branch name for which to return test results',
          },
          commit_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Commit SHA for which to return test results',
          },
          duration_max: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Maximum duration of the test in seconds',
          },
          duration_min: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Minimum duration of the test in seconds',
          },
          outcome: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Status of the test (failure, skip, error, pass)',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        test_id: { type: 'string' },
        failure_message: { type: 'string', title: 'test name' },
        duration_seconds: {
          type: 'number',
          format: 'double',
          title: 'duration in seconds',
          minimum: -1.7976931348623157e308,
          maximum: 1.7976931348623157e308,
        },
        commitid: { type: 'string', title: 'commit SHA' },
        outcome: { type: 'string' },
        branch: { type: 'string', title: 'branch name' },
        repoid: { type: 'integer', title: 'repo id' },
        failure_rate: {
          type: 'number',
          format: 'double',
          readOnly: true,
          minimum: -1.7976931348623157e308,
          maximum: 1.7976931348623157e308,
        },
        name: { type: 'string', readOnly: true, title: 'test name' },
        commits_where_fail: {
          type: 'array',
          items: {},
          readOnly: true,
          title: 'commits where test failed',
        },
      },
      required: [
        'branch',
        'commitid',
        'commits_where_fail',
        'duration_seconds',
        'failure_message',
        'failure_rate',
        'id',
        'name',
        'outcome',
        'repoid',
        'test_id',
      ],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const ReposTotalsRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          repo_name: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'repository name',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'repo_name', 'service'],
      },
      {
        type: 'object',
        properties: {
          branch: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'branch name for which to return report (of head commit)',
          },
          component_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given component id',
          },
          flag: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include info pertaining to given flag name',
          },
          path: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'filter report to only include file paths starting with this value',
          },
          sha: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'commit SHA for which to return report',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        totals: {
          title: 'coverage totals',
          type: 'object',
          required: [
            'branches',
            'complexity',
            'complexity_ratio',
            'complexity_total',
            'coverage',
            'diff',
            'files',
            'hits',
            'lines',
            'messages',
            'methods',
            'misses',
            'partials',
            'sessions',
          ],
          properties: {
            files: { type: 'integer' },
            lines: { type: 'integer' },
            hits: { type: 'integer' },
            misses: { type: 'integer' },
            partials: { type: 'integer' },
            coverage: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            branches: { type: 'integer' },
            methods: { type: 'integer' },
            messages: { type: 'integer' },
            sessions: { type: 'integer' },
            complexity: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_total: {
              type: 'number',
              format: 'double',
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            complexity_ratio: {
              type: 'number',
              format: 'double',
              readOnly: true,
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
            },
            diff: { type: 'object', additionalProperties: true },
          },
        },
        files: {
          readOnly: true,
          title: 'file specific coverage totals',
          type: 'object',
          required: ['line_coverage', 'name', 'totals'],
          properties: {
            name: { type: 'string', title: 'file path' },
            totals: {
              title: 'coverage totals',
              type: 'object',
              required: [
                'branches',
                'complexity',
                'complexity_ratio',
                'complexity_total',
                'coverage',
                'diff',
                'files',
                'hits',
                'lines',
                'messages',
                'methods',
                'misses',
                'partials',
                'sessions',
              ],
              properties: {
                files: { type: 'integer' },
                lines: { type: 'integer' },
                hits: { type: 'integer' },
                misses: { type: 'integer' },
                partials: { type: 'integer' },
                coverage: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                branches: { type: 'integer' },
                methods: { type: 'integer' },
                messages: { type: 'integer' },
                sessions: { type: 'integer' },
                complexity: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_total: {
                  type: 'number',
                  format: 'double',
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                complexity_ratio: {
                  type: 'number',
                  format: 'double',
                  readOnly: true,
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                },
                diff: { type: 'object', additionalProperties: true },
              },
            },
            line_coverage: {
              type: 'array',
              readOnly: true,
              title: 'line-by-line coverage values',
              items: {},
            },
          },
        },
        commit_file_url: {
          type: 'string',
          title:
            'Codecov url to see file coverage on commit. Can be unreliable with partial path names.',
        },
      },
      required: ['commit_file_url', 'files', 'totals'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const RootList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['service'],
      },
      {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              service: {
                readOnly: true,
                enum: [
                  'github',
                  'gitlab',
                  'bitbucket',
                  'github_enterprise',
                  'gitlab_enterprise',
                  'bitbucket_server',
                ],
                type: 'string',
                description:
                  '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
              },
              username: { type: 'string', readOnly: true },
              name: { type: 'string', readOnly: true },
            },
            required: ['name', 'service', 'username'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const RootRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'service'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        service: {
          readOnly: true,
          enum: [
            'github',
            'gitlab',
            'bitbucket',
            'github_enterprise',
            'gitlab_enterprise',
            'bitbucket_server',
          ],
          type: 'string',
          description:
            '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
        },
        username: { type: 'string', readOnly: true },
        name: { type: 'string', readOnly: true },
      },
      required: ['name', 'service', 'username'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const UserSessionsList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'service'],
      },
      {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              username: { type: 'string', readOnly: true },
              name: { type: 'string', readOnly: true },
              has_active_session: { type: 'boolean' },
              expiry_date: { type: 'string', format: 'date-time' },
            },
            required: ['expiry_date', 'has_active_session', 'name', 'username'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const UsersList = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
        },
        required: ['owner_username', 'service'],
      },
      {
        type: 'object',
        properties: {
          activated: { type: 'boolean', $schema: 'http://json-schema.org/draft-04/schema#' },
          is_admin: { type: 'boolean', $schema: 'http://json-schema.org/draft-04/schema#' },
          page: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A page number within the paginated result set.',
          },
          page_size: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Number of results to return per page.',
          },
          search: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'A search term.',
          },
        },
        required: [],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      required: ['count', 'results'],
      properties: {
        count: { type: 'integer', examples: [123] },
        next: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=4'],
        },
        previous: {
          type: 'string',
          format: 'uri',
          examples: ['http://api.example.org/accounts/?page=2'],
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              service: {
                enum: [
                  'github',
                  'gitlab',
                  'bitbucket',
                  'github_enterprise',
                  'gitlab_enterprise',
                  'bitbucket_server',
                ],
                type: 'string',
                description:
                  '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
              },
              username: { type: 'string' },
              name: { type: 'string' },
              activated: { type: 'boolean' },
              is_admin: { type: 'boolean' },
              email: { type: 'string' },
            },
            required: ['activated', 'is_admin', 'service', 'username'],
          },
        },
      },
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const UsersPartialUpdate = {
  body: {
    type: 'object',
    properties: { activated: { type: 'boolean' } },
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
          user_username_or_ownerid: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: ['owner_username', 'service', 'user_username_or_ownerid'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        service: {
          enum: [
            'github',
            'gitlab',
            'bitbucket',
            'github_enterprise',
            'gitlab_enterprise',
            'bitbucket_server',
          ],
          type: 'string',
          description:
            '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
        },
        username: { type: 'string' },
        name: { type: 'string' },
        activated: { type: 'boolean' },
        is_admin: { type: 'boolean' },
        email: { type: 'string' },
      },
      required: ['activated', 'is_admin', 'service', 'username'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
const UsersRetrieve = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          owner_username: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'username from service provider',
          },
          service: {
            type: 'string',
            enum: [
              'bitbucket',
              'bitbucket_server',
              'github',
              'github_enterprise',
              'gitlab',
              'gitlab_enterprise',
            ],
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Git hosting service provider',
          },
          user_username_or_ownerid: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
          },
        },
        required: ['owner_username', 'service', 'user_username_or_ownerid'],
      },
    ],
  },
  response: {
    '200': {
      type: 'object',
      properties: {
        service: {
          enum: [
            'github',
            'gitlab',
            'bitbucket',
            'github_enterprise',
            'gitlab_enterprise',
            'bitbucket_server',
          ],
          type: 'string',
          description:
            '* `github` - Github\n* `gitlab` - Gitlab\n* `bitbucket` - Bitbucket\n* `github_enterprise` - Github Enterprise\n* `gitlab_enterprise` - Gitlab Enterprise\n* `bitbucket_server` - Bitbucket Server\n\n`github` `gitlab` `bitbucket` `github_enterprise` `gitlab_enterprise` `bitbucket_server`',
        },
        username: { type: 'string' },
        name: { type: 'string' },
        activated: { type: 'boolean' },
        is_admin: { type: 'boolean' },
        email: { type: 'string' },
      },
      required: ['activated', 'is_admin', 'service', 'username'],
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const
export {
  ReposBranchesList,
  ReposBranchesRetrieve,
  ReposCommitsList,
  ReposCommitsRetrieve,
  ReposCommitsUploadsList,
  ReposCompareComponentsRetrieve,
  ReposCompareFileRetrieve,
  ReposCompareFlagsRetrieve,
  ReposCompareImpactedFilesRetrieve,
  ReposCompareRetrieve,
  ReposCompareSegmentsRetrieve,
  ReposComponentsList,
  ReposConfigRetrieve,
  ReposCoverageList,
  ReposFileReportRetrieve,
  ReposFlagsCoverageList,
  ReposFlagsList,
  ReposList,
  ReposPullsList,
  ReposPullsRetrieve,
  ReposReportRetrieve,
  ReposReportTreeRetrieve,
  ReposRetrieve,
  ReposTestResultsList,
  ReposTestResultsRetrieve,
  ReposTotalsRetrieve,
  RootList,
  RootRetrieve,
  UserSessionsList,
  UsersList,
  UsersPartialUpdate,
  UsersRetrieve,
}
