import { styled } from "styled-components";

export const Button = styled.button<{color: string, hasborder: boolean, height?: string}>`
    width: 100%;
    background-color: ${({ color }) => color};
    height: ${({ height }) => height ? height : "2.5rem"};
    border: 0;
    border-radius: 0.9375rem;
    font-weight: 400;
    border: ${({ hasborder }) => hasborder ? "1px solid #1D1D1D" : "border: 1px solid #2D60FF"};
    color: ${({ hasborder }) => hasborder ? "#000000" : "#FFFFFF"};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0rem 4px 0.25rem 0.125rem #00000040;
    transition: all 0.3s ease;

    &:hover {
        font-size: 0.875rem;
        font-weight: bold;
    }
`;

export const Icon = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
`