import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationIconProps {
  type: 'prev' | 'next';
  className?: string;
}

export function PaginationIcon({ type, className = '' }: PaginationIconProps) {
  return type === 'prev' ? (
    <IoChevronBack className={`w-4 h-4 ${className}`} />
  ) : (
    <IoChevronForward className={`w-4 h-4 ${className}`} />
  );
}

export default PaginationIcon;