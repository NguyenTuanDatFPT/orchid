import React from 'react';
import { Image } from 'react-bootstrap';
import styles from './OrchidImagePreview.module.css';

export default function OrchidImagePreview({ src }) {
  return (
    <Image src={src} className={styles.imagePreview} thumbnail />
  );
}
