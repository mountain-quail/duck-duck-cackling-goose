import { atom } from "jotai";
import { initialDisplayImage, type DisplayImageState } from "../viewTypes";

export const displayImageAtom = atom<DisplayImageState>(initialDisplayImage());
