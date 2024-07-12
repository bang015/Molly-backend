module.exports = {
  // parser: 코드를 분석할 때 사용할 분석기를 지정한다.
  // @typescript-eslint/parser: typescript 코드를 분석할 때 사용하는 분석기이다.
  parser: '@typescript-eslint/parser',
  // parserOptions: parser에 전달할 옵션을 지정한다.
  parserOptions: {
    // project: typescript 설정 파일을 지정한다.
    // tsconfig.json 파일을 지정한다.
    project: 'tsconfig.json',
    // tsconfigRootDir: tsconfig.json 파일이 있는 디렉토리를 지정한다.
    // __dirname: 현재 파일이 있는 디렉토리를 지정한다.
    tsconfigRootDir: __dirname,
    // sourceType: 코드를 모듈로 사용할지 스크립트로 사용할지 지정한다.
    // module: 코드를 모듈로 사용한다.
    sourceType: 'module',
  },
  // plugins: 사용할 플러그인을 지정한다.
  // @typescript-eslint/eslint-plugin: typescript 코드를 검사하는 플러그인이다.
  plugins: ['@typescript-eslint/eslint-plugin'],
  // extends: 사용할 규칙을 지정한다.
  extends: [
    // plugin:@typescript-eslint/recommended: eslint의 권장 규칙을 사용한다.
    // eslint의 권장 규칙 참고: https://eslint.org/docs/rules/
    'plugin:@typescript-eslint/recommended',
    // plugin:prettier/recommended: prettier의 권장 규칙을 사용한다.
    // prettier의 권장 규칙 참고: https://prettier.io/docs/en/options.html
    'plugin:prettier/recommended',
  ],
  // root: 루트 디렉토리에서 eslint 설정 파일을 찾을지 지정한다.
  root: true,
  // env: 사용할 환경을 지정한다.
  env: {
    // node: node.js 환경을 사용한다.
    node: true,
    // jest: jest 환경을 사용한다.
    jest: true,
  },
  // ignorePatterns: eslint에서 무시할 파일을 지정한다.
  // .eslintrc.js 파일을 무시한다.
  ignorePatterns: ['.eslintrc.js'],
  // rules: 사용할 규칙을 지정한다.
  rules: {
    // @typescript-eslint/interface-name-prefix: 인터페이스 이름에 I를 접두사로 붙여야 한다.
    // off: 규칙을 끈다.
    // 이유1: 인터페이스 이름에 I를 붙이지 않는 것이 현대적인 방식이다.
    // 이유2: 인터페이스 이름에 I를 붙이면 코드가 지저분해진다.
    // 이유3: 개인적으로 I를 붙이는 것이 보기 안좋다고 생각한다.
    '@typescript-eslint/interface-name-prefix': 'off',
    // @typescript-eslint/explicit-function-return-type: 함수의 반환 타입을 명시해야 한다.
    // off: 규칙을 끈다.
    // 이유1: 함수의 반환 타입을 명시하면 코드가 지저분해진다.
    // 이유2: 타입스크립트가 타입을 추론하기 때문에 반환 타입을 명시할 필요가 없다.
    // 이유3: 타입스크립트가 타입을 추론하지 못하는 경우에만 반환 타입을 명시하면 된다.
    '@typescript-eslint/explicit-function-return-type': 'off',
    // @typescript-eslint/explicit-module-boundary-types: 모듈의 반환 타입을 명시해야 한다.
    // off: 규칙을 끈다.
    // 이유: explicit-function-return-type과 같은 이유들
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // @typescript-eslint/no-explicit-any: any 타입을 사용하지 않아야 한다.
    // off: 규칙을 끈다.
    // 이유1: any를 쓰지 않는 것이 좋으나, any를 쓰는 것이 더 편할 때가 있다.
    // any를 쓰는 것이 더 편한 예시: JSON.parse(JSON.stringify(obj))
    // JSON.parse(JSON.stringify(obj))가 무슨 타입인지 모르면 any를 사용하면 된다.
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
