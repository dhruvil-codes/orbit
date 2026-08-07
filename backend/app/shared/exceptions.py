"""
Shared Domain Exception Base Classes
"""

class OrbitDomainException(Exception):
    """Base exception for Orbit domain logic failures."""
    pass

class CompatibilityException(OrbitDomainException):
    """Raised when strategic fit analysis fails."""
    pass

class CaspianCommunicationException(OrbitDomainException):
    """Raised when Caspian dispatch fails."""
    pass
