import React from 'react';
import LICENSE from "project/LICENSE";
import assets from "project/assets.json";
import libraries from "project/libraries.json";
import { LicenseTemplate } from "./template";

export function LicensePage() {
	return <LicenseTemplate license={LICENSE} assets={assets} libraries={libraries} />
}