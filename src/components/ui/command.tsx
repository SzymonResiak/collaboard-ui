'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={className} {...props} />
));
Command.displayName = CommandPrimitive.displayName;

const CommandGroup = CommandPrimitive.Group;
const CommandItem = CommandPrimitive.Item;

export { Command, CommandGroup, CommandItem };
