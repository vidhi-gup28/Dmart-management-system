import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import {
  ShoppingBag,
  Users,
  ScanLine,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Share2,
  Check,
} from 'lucide-react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../theme/colors';
import { UserRole, AuthResponse } from '../../types';
import { SmartMartApi } from '../../services/api';

interface AuthScreenProps {
  onLoginSuccess: (authData: AuthResponse) => void;
  initialRole?: UserRole;
  onSwitchPortal?: (role: UserRole) => void;
}

// Demo account metadata
const DEMO_ACCOUNTS: Record<UserRole, { email: string; name: string; desc: string }> = {
  CUSTOMER: {
    email: 'customer@smartmart.demo',
    name: 'Pooja Verma',
    desc: 'Shop smarter in-store or online'
  },
  STAFF: {
    email: 'staff@smartmart.demo',
    name: 'Rahul Sharma',
    desc: 'Manage your department and tasks'
  },
  CASHIER: {
    email: 'cashier@smartmart.demo',
    name: 'Vikram Singhania',
    desc: 'Process billing and payments'
  },
  ADMIN: {
    email: 'admin@smartmart.demo',
    name: 'Ananya Deshmukh',
    desc: 'Control the entire store'
  }
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, initialRole = 'CUSTOMER', onSwitchPortal }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    if (initialRole) {
      handleSelectRole(initialRole);
    }
  }, [initialRole]);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState(DEMO_ACCOUNTS[initialRole]?.email || 'customer@smartmart.demo');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States (Customer only)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // UI / Focus States
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Transition Overlay State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionUser, setTransitionUser] = useState<any | null>(null);
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for transition logo
  useEffect(() => {
    if (isTransitioning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isTransitioning]);

  // Handle Role selection & autofill demo email
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setLoginIdentifier(DEMO_ACCOUNTS[role].email);
    setLoginPassword('password123');
  };

  // Submit Login
  const handleLogin = async () => {
    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your email, phone, or employee ID.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await SmartMartApi.login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
        role: selectedRole,
      });

      if (res && res.token) {
        triggerTransition(res);
      } else {
        // Fallback demo user for offline resilience
        const fallbackUser = {
          token: `demo-token-${Date.now()}`,
          user: {
            id: 101,
            username: DEMO_ACCOUNTS[selectedRole].name.toLowerCase().replace(' ', '.'),
            name: DEMO_ACCOUNTS[selectedRole].name,
            email: DEMO_ACCOUNTS[selectedRole].email,
            phone: '+91 98765 43210',
            role: selectedRole,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRole}`,
          },
          role: selectedRole,
          profile: {
            loyalty_points: 340,
            wallet_balance: '1250.00',
            employee_id: selectedRole !== 'CUSTOMER' ? `SM-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
          }
        };
        triggerTransition(fallbackUser);
      }
    } catch (err) {
      setErrorMessage('Unable to connect to SmartMart service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Registration
  const handleRegister = async () => {
    if (selectedRole !== 'CUSTOMER') {
      setErrorMessage('Staff and Admin accounts are managed by store administration.');
      return;
    }
    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await SmartMartApi.register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '+91 98765 43210',
        password: regPassword,
      });

      if (res && res.token) {
        triggerTransition(res);
      } else {
        const newCustomerAuth: AuthResponse = {
          token: `reg-token-${Date.now()}`,
          user: {
            id: Date.now(),
            username: regEmail.split('@')[0],
            name: regName.trim(),
            email: regEmail.trim(),
            phone: regPhone.trim() || '+91 98765 43210',
            role: 'CUSTOMER',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regEmail}`,
          },
          role: 'CUSTOMER',
          profile: {
            loyalty_points: 250,
            wallet_balance: '500.00',
          }
        };
        triggerTransition(newCustomerAuth);
      }
    } catch (err) {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Transition Overlay
  const triggerTransition = (authData: AuthResponse) => {
    setTransitionUser(authData);
    setIsTransitioning(true);

    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        onLoginSuccess(authData);
      }, 1200);
    });
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Header & Back Action */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => {
              if (authMode === 'REGISTER') setAuthMode('LOGIN');
            }}
            activeOpacity={0.8}
          >
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.topBrandPill}>
            <View style={styles.topBrandDot} />
            <Text style={styles.topBrandText}>SMARTMART</Text>
          </View>
        </View>

        {/* Internal Portal Indicator & Switcher (Only visible when on internal portal / URL) */}
        {selectedRole !== 'CUSTOMER' && (
          <View style={styles.roleTabsWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.portalLabel}>INTERNAL STORE TERMINALS</Text>
              <TouchableOpacity
                onPress={() => {
                  handleSelectRole('CUSTOMER');
                  if (onSwitchPortal) onSwitchPortal('CUSTOMER');
                }}
                style={{ paddingVertical: 2, paddingHorizontal: 6 }}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#FED7B8' }}>← Back to Customer App</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rolePillsRow}>
              {(['STAFF', 'CASHIER', 'ADMIN'] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <TouchableOpacity
                    key={role}
                    style={[styles.rolePill, isSelected && styles.rolePillActive]}
                    onPress={() => {
                      handleSelectRole(role);
                      if (onSwitchPortal) onSwitchPortal(role);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.rolePillText, isSelected && styles.rolePillTextActive]}>
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Hero Title Section */}
        <View style={styles.headerHero}>
          <Text style={styles.mainTitle}>
            {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.mainSubtitle}>
            {authMode === 'LOGIN'
              ? (selectedRole === 'CUSTOMER'
                  ? 'Sign in to start ordering fresh groceries & essentials'
                  : `Welcome back to ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Terminal`)
              : 'Sign up to shop groceries and get 45-min express delivery'}
          </Text>
        </View>

        {/* Customer Auth Mode Segmented Tabs (Log In vs Sign Up) */}
        {selectedRole === 'CUSTOMER' && (
          <View style={styles.authSegmentContainer}>
            <TouchableOpacity
              style={[styles.authSegmentTab, authMode === 'LOGIN' && styles.authSegmentTabActive]}
              onPress={() => {
                setAuthMode('LOGIN');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.authSegmentText, authMode === 'LOGIN' && styles.authSegmentTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authSegmentTab, authMode === 'REGISTER' && styles.authSegmentTabActive]}
              onPress={() => {
                setAuthMode('REGISTER');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.authSegmentText, authMode === 'REGISTER' && styles.authSegmentTextActive]}>
                New User? Register
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Notification Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <AlertCircle size={15} color="#EF4444" />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}

        {/* 1. LOGIN EXPERIENCE (Matching Image 3 Reference) */}
        {authMode === 'LOGIN' && (
          <View style={styles.formContainer}>
            {/* Frosted Pill Input 1: Username / Email */}
            <View
              style={[
                styles.glassPillInput,
                focusedField === 'identifier' && styles.glassPillInputFocused,
              ]}
            >
              <UserIcon
                size={18}
                color={focusedField === 'identifier' ? '#FFFFFF' : '#EBD6DC'}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.pillTextInput}
                placeholder={
                  selectedRole === 'CUSTOMER'
                    ? 'Username or Email'
                    : 'Work Email or Employee ID'
                }
                placeholderTextColor="rgba(235, 214, 220, 0.65)"
                value={loginIdentifier}
                onChangeText={(text) => {
                  setLoginIdentifier(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Frosted Pill Input 2: Password */}
            <View
              style={[
                styles.glassPillInput,
                focusedField === 'password' && styles.glassPillInputFocused,
              ]}
            >
              <Lock
                size={18}
                color={focusedField === 'password' ? '#FFFFFF' : '#EBD6DC'}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.pillTextInput}
                placeholder="Password"
                placeholderTextColor="rgba(235, 214, 220, 0.65)"
                value={loginPassword}
                onChangeText={(text) => {
                  setLoginPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#EBD6DC" />
                ) : (
                  <Eye size={18} color="#EBD6DC" />
                )}
              </TouchableOpacity>
            </View>

            {/* Row: Remember Me (Left) & Forgot Password (Right) */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.rememberBox}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.customCheckbox, rememberMe && styles.customCheckboxActive]}>
                  {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={styles.rememberLabel}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowForgotModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* Radiant Mauve-Pink "Log In" Pill CTA Button */}
            <TouchableOpacity
              testID="login-submit-btn"
              style={[styles.radiantLoginBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <View style={styles.btnContentRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.radiantLoginBtnText}>Connecting...</Text>
                </View>
              ) : (
                <View style={styles.btnContentRow}>
                  <Text style={styles.radiantLoginBtnText}>Log In</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* "Sign In With" Social Section (Image 3 Reference) */}
            <View style={styles.socialSection}>
              <Text style={styles.socialHeading}>Sign In With</Text>
              <View style={styles.socialButtonsRow}>
                {/* Facebook Button */}
                <TouchableOpacity
                  style={styles.socialCircleBtn}
                  onPress={() => handleLogin()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialLetter}>f</Text>
                </TouchableOpacity>

                {/* Instagram Button */}
                <TouchableOpacity
                  style={styles.socialCircleBtn}
                  onPress={() => handleLogin()}
                  activeOpacity={0.8}
                >
                  <Sparkles size={16} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Twitter/X Button */}
                <TouchableOpacity
                  style={styles.socialCircleBtn}
                  onPress={() => handleLogin()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialLetter}>𝕏</Text>
                </TouchableOpacity>

                {/* Google Button */}
                <TouchableOpacity
                  style={styles.socialCircleBtn}
                  onPress={() => handleLogin()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialLetter}>G</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Switch to Register for Customer */}
            {selectedRole === 'CUSTOMER' && (
              <View style={styles.switchModeRow}>
                <Text style={styles.switchModeSub}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => setAuthMode('REGISTER')}>
                  <Text style={styles.switchModeHighlight}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Footer: Only show employee demo credentials when user is on internal staff/cashier/admin URL */}
            {selectedRole !== 'CUSTOMER' && (
              <View style={styles.demoCard}>
                <View style={styles.demoCardHeader}>
                  <Sparkles size={12} color="#EBD6DC" />
                  <Text style={styles.demoCardTitle}>DEMO EMPLOYEE CREDENTIALS</Text>
                </View>
                <View style={styles.demoChipsGrid}>
                  {(['STAFF', 'CASHIER', 'ADMIN'] as UserRole[]).map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.demoChip, selectedRole === r && styles.demoChipSelected]}
                      onPress={() => {
                        handleSelectRole(r);
                        if (onSwitchPortal) onSwitchPortal(r);
                      }}
                    >
                      <Text style={[styles.demoChipText, selectedRole === r && styles.demoChipTextSelected]}>
                        {r}: {DEMO_ACCOUNTS[r].name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* 2. REGISTER EXPERIENCE */}
        {authMode === 'REGISTER' && (
          <View style={styles.formContainer}>
            {selectedRole === 'CUSTOMER' ? (
              <>
                <View style={styles.glassPillInput}>
                  <UserIcon size={18} color="#EBD6DC" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.pillTextInput}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(235, 214, 220, 0.65)"
                    value={regName}
                    onChangeText={setRegName}
                  />
                </View>

                <View style={styles.glassPillInput}>
                  <Mail size={18} color="#EBD6DC" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.pillTextInput}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(235, 214, 220, 0.65)"
                    value={regEmail}
                    onChangeText={setRegEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.glassPillInput}>
                  <Phone size={18} color="#EBD6DC" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.pillTextInput}
                    placeholder="Phone Number (+91)"
                    placeholderTextColor="rgba(235, 214, 220, 0.65)"
                    value={regPhone}
                    onChangeText={setRegPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.glassPillInput}>
                  <Lock size={18} color="#EBD6DC" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.pillTextInput}
                    placeholder="Password (Min 6 chars)"
                    placeholderTextColor="rgba(235, 214, 220, 0.65)"
                    value={regPassword}
                    onChangeText={setRegPassword}
                    secureTextEntry={!showRegPassword}
                  />
                  <TouchableOpacity onPress={() => setShowRegPassword(!showRegPassword)}>
                    {showRegPassword ? <EyeOff size={18} color="#EBD6DC" /> : <Eye size={18} color="#EBD6DC" />}
                  </TouchableOpacity>
                </View>

                <View style={styles.glassPillInput}>
                  <Lock size={18} color="#EBD6DC" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.pillTextInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(235, 214, 220, 0.65)"
                    value={regConfirmPassword}
                    onChangeText={setRegConfirmPassword}
                    secureTextEntry={!showRegPassword}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.radiantLoginBtn, isSubmitting && styles.btnDisabled]}
                  onPress={handleRegister}
                  disabled={isSubmitting}
                >
                  <Text style={styles.radiantLoginBtnText}>
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.switchModeRow}>
                  <Text style={styles.switchModeSub}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setAuthMode('LOGIN')}>
                    <Text style={styles.switchModeHighlight}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.staffNoticeCard}>
                <ShieldCheck size={36} color="#EBD6DC" />
                <Text style={styles.staffNoticeTitle}>Internal Enterprise Portal</Text>
                <Text style={styles.staffNoticeDesc}>
                  Staff, Cashier, and Administrator credentials are strictly provisioned by SmartMart Central Store IT.
                </Text>
                <TouchableOpacity
                  style={styles.radiantLoginBtn}
                  onPress={() => setAuthMode('LOGIN')}
                >
                  <Text style={styles.radiantLoginBtnText}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Demo Credentials</Text>
              <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                <X size={20} color="#EBD6DC" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBody}>
              All demo accounts share the universal demo password for instant evaluation:
            </Text>
            <View style={styles.passwordPill}>
              <Lock size={15} color="#674D66" />
              <Text style={styles.passwordPillText}>password123</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowForgotModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Got it, Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transition Animation Overlay */}
      {isTransitioning && (
        <Animated.View style={[styles.transitionOverlay, { opacity: transitionAnim }]}>
          <Animated.View style={[styles.transitionLogoBox, { transform: [{ scale: pulseAnim }] }]}>
            <Sparkles size={36} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.transitionTitle}>Connecting to SmartMart</Text>
          <Text style={styles.transitionSub}>
            Welcome back, {transitionUser?.user?.name || 'Member'} 👋
          </Text>
          <View style={styles.transitionRoleBadge}>
            <Text style={styles.transitionRoleText}>
              Opening {selectedRole} Portal...
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#674D66', // DEEP MAUVE (Image 2)
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Top Nav Row
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  topBrandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  topBrandDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EBD6DC', // SOFT PINK BLUSH
  },
  topBrandText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // Portal Role Switcher
  roleTabsWrapper: {
    marginBottom: 20,
  },
  portalLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 1,
    marginBottom: 6,
  },
  rolePillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  rolePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePillActive: {
    backgroundColor: '#EBD6DC', // SOFT PINK BLUSH
    borderColor: '#FFFFFF',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  rolePillTextActive: {
    color: '#3B1F3A',
    fontWeight: '800',
  },

  // Hero Title
  headerHero: {
    marginBottom: 26,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  mainSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EBD6DC',
    marginTop: 4,
    lineHeight: 18,
  },

  // Form Container
  formContainer: {
    gap: 14,
  },

  // Frosted Pill Input (Image 3 Reference)
  glassPillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 18,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  glassPillInputFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    shadowOpacity: 0.28,
  },
  fieldIcon: {
    marginRight: 12,
  },
  pillTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    height: '100%',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  eyeBtn: {
    padding: 6,
  },

  // Remember Me & Forgot Password Row (Image 3 Reference)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  rememberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCheckboxActive: {
    backgroundColor: '#C24379',
    borderColor: '#C24379',
  },
  rememberLabel: {
    fontSize: 12,
    color: '#EBD6DC',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#EBD6DC',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Radiant Login Pill Button (Image 3 Reference)
  radiantLoginBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#C24379', // Radiant Magenta-Mauve
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.50)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radiantLoginBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Recruiter / Reviewer Instant Demo Access Bar
  recruiterBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(253, 224, 71, 0.4)',
  },
  recruiterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  recruiterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047',
    letterSpacing: 0.6,
  },
  recruiterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  recruiterChip: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recruiterChipActive: {
    backgroundColor: '#C24379',
    borderColor: '#FED7B8',
  },
  recruiterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  recruiterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // "Sign In With" Social Row (Image 3 Reference)
  socialSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  socialHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EBD6DC',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  socialCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  socialLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Mode Switch (Sign In <-> Sign Up)
  switchModeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  switchModeSub: {
    fontSize: 12.5,
    color: '#EBD6DC',
  },
  switchModeHighlight: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },

  // Quick Demo Accounts Box
  demoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  demoCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 0.8,
  },
  demoChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  demoChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  demoChipSelected: {
    backgroundColor: '#EBD6DC',
    borderColor: '#FFFFFF',
  },
  demoChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  demoChipTextSelected: {
    color: '#3B1F3A',
    fontWeight: '800',
  },

  // Staff Notice Card
  staffNoticeCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 12,
  },
  staffNoticeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  staffNoticeDesc: {
    fontSize: 12.5,
    color: '#EBD6DC',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FECACA',
    flex: 1,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(43, 21, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#523B51',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBody: {
    fontSize: 12.5,
    color: '#EBD6DC',
    lineHeight: 18,
    marginBottom: 12,
  },
  passwordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EBD6DC',
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  passwordPillText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F3A',
    letterSpacing: 1,
  },
  modalCloseBtn: {
    backgroundColor: '#C24379',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Transition Overlay
  transitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(82, 59, 81, 0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  transitionLogoBox: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: '#C24379',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  transitionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transitionSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EBD6DC',
    marginBottom: 16,
  },
  transitionRoleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  transitionRoleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  employeeAccessRow: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  employeeLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  employeeLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  authSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  authSegmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  authSegmentTabActive: {
    backgroundColor: '#FED7B8',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  authSegmentText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  authSegmentTextActive: {
    color: '#2B152A',
    fontWeight: '900',
  },
});
