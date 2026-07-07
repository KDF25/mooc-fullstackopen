declare module "*.mdx" {
  import type { MDXProps } from "mdx/types"
  export default function MDXComponent(props: MDXProps): JSX.Element
}
