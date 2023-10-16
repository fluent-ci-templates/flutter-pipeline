import { gql } from "../../deps.ts";

export const codeQuality = gql`
  query codeQuality($src: String!) {
    codeQuality(src: $src)
  }
`;

export const test = gql`
  query test($src: String!) {
    test(src: $src)
  }
`;

export const build = gql`
  query build($src: String!) {
    build(src: $src)
  }
`;
