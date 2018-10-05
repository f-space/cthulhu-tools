import React from 'react';
import { PropertyResolver, VoidResolver } from "models/status";

export const Resolver = React.createContext<PropertyResolver>(new VoidResolver());