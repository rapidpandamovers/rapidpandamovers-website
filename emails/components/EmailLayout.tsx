import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://www.rapidpandamovers.com/images/rapidpandamovers-logo.png"
              width="200"
              height="auto"
              alt="Rapid Panda Movers"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Rapid Panda Movers</strong>
            </Text>
            <Text style={footerText}>
              7001 North Waterway Dr #107, Miami, FL 33155
            </Text>
            <Text style={footerText}>
              <Link href="tel:7865854269" style={footerLink}>(786) 585-4269</Link>
              {' | '}
              <Link href="mailto:info@rapidpandamovers.com" style={footerLink}>info@rapidpandamovers.com</Link>
            </Text>
            <Text style={footerText}>
              <Link href="https://www.rapidpandamovers.com" style={footerLink}>www.rapidpandamovers.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px 0',
};

const header: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '24px 32px',
  borderBottom: '3px solid #f97316',
  textAlign: 'center' as const,
};

const logo: React.CSSProperties = {
  margin: '0 auto',
};

const content: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '0 0 12px 12px',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footer: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '0 32px',
};

const footerText: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footerLink: React.CSSProperties = {
  color: '#f97316',
  textDecoration: 'none',
};
