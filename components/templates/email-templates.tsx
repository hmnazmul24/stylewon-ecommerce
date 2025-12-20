import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Preview,
  Section,
} from "@react-email/components";

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
      <Preview>
        Verify your email address to activate your Stylewon account
      </Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={{ textAlign: "center" }}>
            <Text style={brand}>Stylewon</Text>
          </Section>

          <Text style={text}>Hello,</Text>

          <Text style={text}>
            Please confirm your email address to complete your Stylewon account
            setup.
          </Text>

          <Section style={{ margin: "24px 0", textAlign: "center" }}>
            <Button href={verifyUrl} style={button}>
              Verify email
            </Button>
          </Section>

          <Text style={muted}>
            This link will expire in {expiresInMinutes} minutes.
          </Text>

          {/* Fallback link (VERY important for email clients) */}
          <Text style={fallback}>
            Or copy and paste this URL into your browser:
            <br />
            <a href={verifyUrl} style={link}>
              {verifyUrl}
            </a>
          </Text>

          <Text style={footer}>
            If you did not create a Stylewon account, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

//--------------------------------------------------------//

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
      <Preview>Your Stylewon verification code</Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={{ textAlign: "center" }}>
            <Text style={brand}>Stylewon</Text>
          </Section>

          <Text style={text}>Hello,</Text>

          <Text style={text}>
            Use the verification code below to confirm your email address.
          </Text>

          <Section style={otpContainer}>
            <Text style={otpStyle}>{otp}</Text>
          </Section>

          <Text style={muted}>
            This code will expire in {expiresInMinutes} minutes.
          </Text>

          <Text style={footer}>
            For security reasons, do not share this code with anyone.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "24px",
};

const text = {
  fontSize: "14px",
  color: "#111111",
  lineHeight: "1.6",
};

const button = {
  backgroundColor: "#111111",
  color: "#ffffff",
  padding: "14px 24px",
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

const footer = {
  fontSize: "12px",
  color: "#888888",
  marginTop: "24px",
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

const otpContainer = {
  backgroundColor: "#f2f2f2",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpStyle = {
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "6px",
};
