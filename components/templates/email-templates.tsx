import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Preview,
  Section,
  Hr,
} from "@react-email/components";

/* ---------------------------------------------------------------- */
/* Email Verification — Link */
/* ---------------------------------------------------------------- */

interface EmailVerificationLinkProps {
  verifyUrl: string;
  expiresInMinutes: number;
}

export function EmailVerificationLinkTemplate({
  verifyUrl,
  expiresInMinutes,
}: EmailVerificationLinkProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email for Stylewon</Preview>

      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>Stylewon</Text>

          <Text style={text}>Hello,</Text>

          <Text style={text}>
            You’re receiving this email because someone signed up for a Stylewon
            account using this email address.
          </Text>

          <Text style={text}>
            Please confirm your email address to complete the setup.
          </Text>

          <Section style={center}>
            <Button href={verifyUrl} style={button}>
              Confirm email
            </Button>
          </Section>

          <Text style={muted}>
            This link will expire in {expiresInMinutes} minutes.
          </Text>

          <Text style={fallback}>
            If the button doesn’t work, copy and paste this link into your
            browser:
            <br />
            <a href={verifyUrl} style={link}>
              {verifyUrl}
            </a>
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            Stylewon is an online platform for modern shopping experiences.
            <br />
            If you didn’t request this email, no action is required.
            <br />
            <br />© {new Date().getFullYear()} Stylewon. All rights reserved.
            <br />
            Contact: support@stylewon.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/* ---------------------------------------------------------------- */
/* Email Verification — OTP */
/* ---------------------------------------------------------------- */

interface EmailVerificationOtpProps {
  otp: string;
  expiresInMinutes: number;
}

export function EmailVerificationOtpTemplate({
  otp,
  expiresInMinutes,
}: EmailVerificationOtpProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Stylewon confirmation code</Preview>

      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>Stylewon</Text>

          <Text style={text}>Hello,</Text>

          <Text style={text}>
            You’re receiving this email because someone is trying to verify an
            email address for a Stylewon account.
          </Text>

          <Text style={text}>Use the code below to confirm your email:</Text>

          <Section style={otpContainer}>
            <Text style={otpStyle}>{otp}</Text>
          </Section>

          <Text style={muted}>
            This code will expire in {expiresInMinutes} minutes.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            For security reasons, do not share this code.
            <br />
            If you didn’t request this, you can ignore this email.
            <br />
            <br />© {new Date().getFullYear()} Stylewon. All rights reserved.
            <br />
            Contact: support@stylewon.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/* ---------------------------------------------------------------- */
/* Styles */
/* ---------------------------------------------------------------- */

const body = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "12px",
  maxWidth: "480px",
  margin: "40px auto",
};

const brand = {
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "24px",
};

const text = {
  fontSize: "14px",
  color: "#111111",
  lineHeight: "1.6",
};

const center = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#111111",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
};

const muted = {
  fontSize: "13px",
  color: "#666666",
  marginTop: "16px",
};

const fallback = {
  fontSize: "12px",
  color: "#666666",
  marginTop: "16px",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#111111",
  textDecoration: "underline",
};

const divider = {
  margin: "24px 0",
  borderColor: "#eeeeee",
};

const footer = {
  fontSize: "11px",
  color: "#888888",
  lineHeight: "1.6",
};

const otpContainer = {
  backgroundColor: "#f2f2f2",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpStyle = {
  fontSize: "26px",
  fontWeight: "700",
  letterSpacing: "6px",
};
