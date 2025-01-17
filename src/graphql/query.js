import { gql } from "@apollo/client";

export const GetAllMarkings = gql`
    query AllMarkings {
        getAllMarkings {
            category
            isApproved
            id
            content
            title
            regionId
            poster
            createdAt
            location {
                latitude
                longitude
            }
            trashTypes
        }
    }
`;