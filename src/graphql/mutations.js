import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation Signin($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const SIGNUP = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(input: { username: $username, email: $email, password: $password }) {
      id
    }
  }
`;

export const AddFiles = gql`
  mutation MyMutation($files: [Upload!]) {
    uploadFile(input: {files: $files}) {
      paths
    }
  }
`

export const MarkingAdd = gql`
  mutation MyMutation(
    $category: Category,
    $content: String,
    $regionId: ID!,
    $title: String,
    $trashTypes: [String!],
    $poster: String,
    $latitude: Float!,
    $longitude: Float!,
    $files: [FileInput!]!
    $isApproved: Boolean!
  ) {
    createMarking(
      input: {
        regionId: $regionId,
        category: $category,
        content: $content,
        trashTypes: $trashTypes,
        title: $title,
        poster: $poster,
        location: { latitude: $latitude, longitude: $longitude },
        files: $files,
        isApproved: $isApproved
      }
    ) {
      id
    }
  }
`;

export const MarkingUpdateWithDetails = gql`
  mutation UpdateMarking(
    $id: ID!,
    $category: Category,
    $content: String,
    $files: [FileInput!],
    $latitude: Float!,
    $longitude: Float!,
    $poster: String,
    $regionId: ID!,
    $title: String,
    $trashTypes: [String!]
    $isApproved: Boolean
  ) {
    updateMarking(
      id: $id,
      input: {
        category: $category,
        content: $content,
        files: $files,
        isApproved: $isApproved,
        location: { latitude: $latitude, longitude: $longitude },
        poster: $poster,
        regionId: $regionId,
        title: $title,
        trashTypes: $trashTypes
      }
    ) {
      id
      isApproved
    }
  }
`;

export const MarkingUpdate = gql`
  mutation MyMutation($id: ID!, $isApproved: Boolean!) {
    updateMarking(id: $id, input: { isApproved: $isApproved }) {
      title
    }
  }
`;

export const Refresh = gql`
  mutation Refresh($refreshToken: String!) {
    refresh(input: {refreshToken: $refreshToken}) {
      accessToken
      refreshToken
    }
  }
`

export const MarkingDelete = gql`
  mutation deleteMarking($id: ID!) {
    deleteMarking(id: $id) {
      id
    }
  }
`;

export const AddRegion = gql`
  mutation RegionAdd($name: String!) {
    createRegion(input: { name: $name }) {
      id
      name
    }
  }
`;

export const deleteRegion = gql`
  mutation RegionAdd($id: ID!) {
    deleteRegion(id: $id) {
      name
    }
  }
`